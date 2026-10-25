import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  BebidaDto,
  CrearIngestaCafeinaDto,
  IngestaCafeinaRespuestaDto,
  ResidualCafeinaRespuestaDto,
  ResumenCafeinaDto,
} from '@circadiano/contracts';
import {
  residual,
  calcularCafeinaActiva,
  calcularHoraCorte,
  resumirConsumoPorDia,
  IngestaCafeina as DominioIngesta,
  UMBRAL_CAFEINA_MG_DEFECTO,
  SEMIVIDA_H_DEFECTO,
  ZONA_HORARIA_EMPRESA,
} from '@circadiano/domain';
import { ParametrosService } from '../plataforma/parametros/parametros.service';

const MS_H = 3_600_000;
// America/Lima es UTC-5 todo el año.
const ZONA_LIMA = '-05:00';

@Injectable()
export class CafeinaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly parametros: ParametrosService,
  ) {}

  async obtenerBebidas(): Promise<BebidaDto[]> {
    const bebidas = await this.prisma.bebida.findMany({
      orderBy: { nombre: 'asc' },
    });
    return bebidas.map((b) => ({
      id_bebida: b.id_bebida,
      nombre: b.nombre,
      cafeina_mg: Number(b.cafeina_mg),
      volumen_ml: b.volumen_ml,
    }));
  }

  async registrarIngesta(dto: CrearIngestaCafeinaDto): Promise<IngestaCafeinaRespuestaDto> {
    const existente = await this.prisma.ingestaCafeina.findUnique({
      where: { client_id: dto.client_id },
    });
    if (existente) {
      // Un client_id de otro usuario no debe devolver su ingesta.
      if (existente.id_usuario !== dto.id_usuario) {
        throw new ConflictException('client_id ya usado');
      }
      return {
        id_ingesta: existente.id_ingesta,
        id_usuario: existente.id_usuario,
        id_bebida: existente.id_bebida,
        cafeina_mg: Number(existente.cafeina_mg),
        fecha_hora: existente.fecha_hora.toISOString(),
        residual_estimado_mg: Number(existente.residual_estimado_mg),
        client_id: existente.client_id,
      };
    }

    let cafeinaMg = dto.cafeina_mg;
    if (dto.id_bebida) {
      const bebida = await this.prisma.bebida.findUnique({
        where: { id_bebida: dto.id_bebida },
      });
      if (bebida && (cafeinaMg === undefined || cafeinaMg === null)) {
        cafeinaMg = Number(bebida.cafeina_mg);
      }
    }
    if (cafeinaMg === undefined || cafeinaMg === null) {
      cafeinaMg = 0;
    }

    const fechaHora = new Date(dto.fecha_hora);

    const previas = await this.prisma.ingestaCafeina.findMany({
      where: {
        id_usuario: dto.id_usuario,
        fecha_hora: { lte: fechaHora },
      },
    });

    const dominioIngestas: DominioIngesta[] = previas.map((p) => ({
      dosisMg: Number(p.cafeina_mg),
      hora: p.fecha_hora.getTime() / 3600000,
    }));
    dominioIngestas.push({
      dosisMg: cafeinaMg,
      hora: fechaHora.getTime() / 3600000,
    });

    const semivida = SEMIVIDA_H_DEFECTO;
    const residualEstimado = residual(dominioIngestas, fechaHora.getTime() / 3600000, semivida);

    const nueva = await this.prisma.ingestaCafeina.create({
      data: {
        id_usuario: dto.id_usuario,
        id_bebida: dto.id_bebida ?? null,
        cafeina_mg: cafeinaMg,
        fecha_hora: fechaHora,
        residual_estimado_mg: residualEstimado,
        client_id: dto.client_id,
      },
    });

    return {
      id_ingesta: nueva.id_ingesta,
      id_usuario: nueva.id_usuario,
      id_bebida: nueva.id_bebida,
      cafeina_mg: Number(nueva.cafeina_mg),
      fecha_hora: nueva.fecha_hora.toISOString(),
      residual_estimado_mg: Number(nueva.residual_estimado_mg),
      client_id: nueva.client_id,
    };
  }

  async listarIngestas(idUsuario: string, fecha: string): Promise<IngestaCafeinaRespuestaDto[]> {
    // El día es el de Lima, no el de UTC: un café a las 20:00 en Lima sigue siendo de ese día.
    const inicio = new Date(`${fecha}T00:00:00.000${ZONA_LIMA}`);
    const fin = new Date(`${fecha}T23:59:59.999${ZONA_LIMA}`);

    const ingestas = await this.prisma.ingestaCafeina.findMany({
      where: {
        id_usuario: idUsuario,
        fecha_hora: {
          gte: inicio,
          lte: fin,
        },
      },
      orderBy: { fecha_hora: 'asc' },
    });

    return ingestas.map((i) => ({
      id_ingesta: i.id_ingesta,
      id_usuario: i.id_usuario,
      id_bebida: i.id_bebida,
      cafeina_mg: Number(i.cafeina_mg),
      fecha_hora: i.fecha_hora.toISOString(),
      residual_estimado_mg: Number(i.residual_estimado_mg),
      client_id: i.client_id,
    }));
  }

  async eliminarIngesta(idIngesta: number, idUsuario: string): Promise<void> {
    try {
      await this.prisma.ingestaCafeina.delete({
        where: { id_ingesta: idIngesta, id_usuario: idUsuario },
      });
    } catch {
      throw new NotFoundException(`Ingesta con ID ${idIngesta} no encontrada`);
    }
  }

  async calcularResidualHastaSueno(
    idUsuario: string,
    hastaHora: number,
  ): Promise<ResidualCafeinaRespuestaDto> {
    const paramUmbral = await this.prisma.parametroSistema.findUnique({
      where: { clave: 'umbral_cafeina_mg' },
    });
    const umbral = paramUmbral ? parseFloat(paramUmbral.valor) : UMBRAL_CAFEINA_MG_DEFECTO;
    const semivida = SEMIVIDA_H_DEFECTO;

    const ingestas = await this.prisma.ingestaCafeina.findMany({
      where: { id_usuario: idUsuario },
      orderBy: { fecha_hora: 'asc' },
    });

    const dominioIngestas: DominioIngesta[] = ingestas.map((i) => ({
      dosisMg: Number(i.cafeina_mg),
      hora: i.fecha_hora.getTime() / 3600000,
    }));

    const residualMg = residual(dominioIngestas, hastaHora, semivida);
    const superaUmbral = residualMg > umbral;

    const horaCorte = calcularHoraCorte(100, hastaHora, dominioIngestas, semivida, umbral);

    const sugerencia = superaUmbral
      ? 'Se recomienda evitar cafeína o cambiar a una bebida descafeinada (infusión o agua) para asegurar un descanso óptimo.'
      : 'El nivel de cafeína residual se encuentra dentro del umbral recomendado para el descanso.';

    return {
      residual_mg: Number(residualMg.toFixed(1)),
      umbral_mg: umbral,
      supera_umbral: superaUmbral,
      hora_corte: horaCorte !== null ? Number(horaCorte.toFixed(2)) : null,
      sugerencia,
    };
  }

  /** GET /cafeina/resumen: consumo por día y cafeína activa estimada (RF09). */
  async obtenerResumen(idUsuario: string, dias: number, ahora = new Date()): Promise<ResumenCafeinaDto> {
    // Cubre los `dias` días de Lima y la ventana de 24 h de la cafeína activa.
    const desde = new Date(ahora.getTime() - (dias + 1) * 24 * MS_H);
    const [filas, umbral] = await Promise.all([
      this.prisma.ingestaCafeina.findMany({
        where: { id_usuario: idUsuario, fecha_hora: { gte: desde, lte: ahora } },
        select: { cafeina_mg: true, fecha_hora: true },
      }),
      this.leerUmbralCafeina(),
    ]);
    const ingestas: DominioIngesta[] = filas.map((f) => ({
      dosisMg: Number(f.cafeina_mg),
      hora: f.fecha_hora.getTime() / MS_H,
    }));
    const ahoraH = ahora.getTime() / MS_H;
    // shortcut: semivida por defecto (RN03) como en PlanesService; leer usuario.semivida_h cuando I1 lo exponga.
    const semivida = SEMIVIDA_H_DEFECTO;

    const consumo = resumirConsumoPorDia(ingestas, ahoraH, dias).map((d) => ({
      ...d,
      totalMg: Math.round(d.totalMg),
    }));
    const activa = calcularCafeinaActiva(ingestas, ahoraH, semivida, umbral);

    return {
      zonaHoraria: ZONA_HORARIA_EMPRESA,
      dias: consumo,
      hoy: consumo[consumo.length - 1],
      cafeinaActiva: {
        mg: Math.round(activa.mg),
        calculadoEn: ahora.toISOString(),
        horaNivelBajo: activa.horaNivelBajo === null
          ? null
          : new Date(activa.horaNivelBajo * MS_H).toISOString(),
        semividaH: semivida,
        umbralMg: umbral,
        esEstimacion: true,
      },
    };
  }

  private async leerUmbralCafeina(): Promise<number> {
    const parametros = await this.parametros.listar();
    const valor = Number(parametros.find((p) => p.clave === 'umbral_cafeina_mg')?.valor);
    return Number.isFinite(valor) && valor > 0 ? valor : UMBRAL_CAFEINA_MG_DEFECTO;
  }

  async sincronizarLote(lote: CrearIngestaCafeinaDto[]): Promise<IngestaCafeinaRespuestaDto[]> {
    const resultados: IngestaCafeinaRespuestaDto[] = [];
    for (const dto of lote) {
      const res = await this.registrarIngesta(dto);
      resultados.push(res);
    }
    return resultados;
  }
}
