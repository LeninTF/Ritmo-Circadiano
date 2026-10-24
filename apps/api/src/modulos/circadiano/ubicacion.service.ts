import { Injectable, NotFoundException } from '@nestjs/common';
import type { CrearUbicacionDto, EventoSolarDto, SedeEmpresa, UbicacionDto } from '@circadiano/contracts';
import { SEDES_EMPRESA, ZONA_HORARIA_EMPRESA, calcularEventosSolares } from '@circadiano/domain';
import { PrismaService } from '../../prisma/prisma.service';

const MS_DIA = 86_400_000;

/** RF06: ubicacion del trabajador y cache de eventos solares. */
@Injectable()
export class UbicacionService {
  constructor(private readonly prisma: PrismaService) {}

  async registrar(idUsuario: string, dto: CrearUbicacionDto): Promise<UbicacionDto> {
    const fila = await this.prisma.ubicacion.create({
      data: { idUsuario, lat: dto.lat, lng: dto.lng, origen: dto.origen, zonaHoraria: ZONA_HORARIA_EMPRESA },
    });
    return {
      id: fila.id,
      lat: Number(fila.lat),
      lng: Number(fila.lng),
      origen: fila.origen,
      zonaHoraria: fila.zonaHoraria,
    };
  }

  /** Coordenadas de la ultima ubicacion; sin ninguna, la sede Ica. */
  async obtenerCoordenadas(idUsuario: string): Promise<SedeEmpresa> {
    const fila = await this.ultima(idUsuario);
    return fila ? { nombre: fila.origen, lat: Number(fila.lat), lng: Number(fila.lng) } : SEDES_EMPRESA[0];
  }

  /** Eventos solares de `dias` dias desde `desde`; solo calcula y guarda los que faltan. */
  async listarEventos(idUsuario: string, desde: string, dias: number): Promise<EventoSolarDto[]> {
    const ubicacion = await this.ultima(idUsuario);
    if (!ubicacion) throw new NotFoundException('Primero registra tu ubicación.');

    const inicio = Date.parse(`${desde}T00:00:00Z`);
    const fechas = Array.from({ length: dias }, (_, i) => new Date(inicio + i * MS_DIA).toISOString().slice(0, 10));
    const guardados = await this.prisma.eventoSolar.findMany({
      where: { idUbicacion: ubicacion.id, fecha: { in: fechas.map((f) => new Date(f)) } },
    });
    const enCache = new Set(guardados.map((e) => e.fecha.toISOString().slice(0, 10)));

    const nuevos = fechas
      .filter((f) => !enCache.has(f))
      .map((f) => {
        const solar = calcularEventosSolares(Number(ubicacion.lat), Number(ubicacion.lng), f);
        return { idUbicacion: ubicacion.id, fecha: new Date(f), amanecer: solar.amanecer, mediodia: solar.mediodia, atardecer: solar.atardecer };
      });
    if (nuevos.length) await this.prisma.eventoSolar.createMany({ data: nuevos, skipDuplicates: true });

    return [...guardados, ...nuevos]
      .map((e) => ({
        fecha: e.fecha.toISOString().slice(0, 10),
        amanecer: e.amanecer.toISOString(),
        mediodia: e.mediodia.toISOString(),
        atardecer: e.atardecer.toISOString(),
      }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  private ultima(idUsuario: string) {
    return this.prisma.ubicacion.findFirst({ where: { idUsuario }, orderBy: { creadoEn: 'desc' } });
  }
}
