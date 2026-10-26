import { Injectable, BadRequestException } from '@nestjs/common';
import { DiarioService } from '../trabajador/diario.service';
import { PrismaService } from '../../prisma/prisma.service';
import type { HistorialDiaDto, HistorialRespuestaDto } from '@circadiano/contracts';
import type { DiarioRespuestaDto } from '@circadiano/contracts';
import { residual, SEMIVIDA_H_DEFECTO } from '@circadiano/domain';
import type { IngestaCafeina as DominioIngesta } from '@circadiano/domain';

@Injectable()
export class HistorialService {
  constructor(
    private readonly diarioService: DiarioService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Devuelve historial diario de sueño, cafeína residual y adherencia
   * para los últimos 7, 14 o 30 días.
   */
  async getHistorial(
    idUsuario: string,
    dias: number,
  ): Promise<HistorialRespuestaDto> {
    // Validar periodo permitido
    if (![7, 14, 30].includes(dias)) {
      throw new BadRequestException(
        'El parámetro dias debe ser uno de los siguientes: 7, 14 o 30',
      );
    }

    const hastaStr = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
    // Estas fechas UTC representan claves civiles, no instantes de medianoche en Lima.
    const desde = new Date(`${hastaStr}T00:00:00.000Z`);
    desde.setUTCDate(desde.getUTCDate() - dias + 1);
    const desdeStr = this.formatearFechaISO(desde);

    // Consultar registros de sueño en el rango
    const diarios =
      await this.diarioService.consultarDiarios(idUsuario, desdeStr, hastaStr);

    // Mapear por fecha para acceso rápido
    const mapaDiarios = new Map<string, DiarioRespuestaDto>();
    for (const d of diarios) {
      mapaDiarios.set(d.fecha, d);
    }

    // Obtener todas las ingestas del usuario (necesarias para calcular residuales históricos)
    const todasIngestas = await this.prisma.ingestaCafeina.findMany({
      where: { id_usuario: idUsuario },
      orderBy: { fecha_hora: 'asc' },
    });

    // Convertir a formato de dominio
    const ingestasDominio: DominioIngesta[] = todasIngestas.map((i) => ({
      dosisMg: Number(i.cafeina_mg),
      hora: i.fecha_hora.getTime() / 3600000, // ms a horas desde epoch
    }));

    // Construir respuesta día a día
    const resultado: HistorialDiaDto[] = [];

    for (let i = 0; i < dias; i++) {
      const fechaActual = new Date(desde);
      fechaActual.setUTCDate(desde.getUTCDate() + i);
      const fechaStr = this.formatearFechaISO(fechaActual);

      const registro = mapaDiarios.get(fechaStr);
      let horasSueno: number | null = null;
      let cafeinaResidual: number | null = null;

      if (registro) {
        const horaAcostarse = new Date(registro.horaAcostarse);
        const horaDespertar = new Date(registro.horaDespertar);
        const duracionMs = horaDespertar.getTime() - horaAcostarse.getTime();
        const duracionHoras = duracionMs / (1000 * 60 * 60);
        // Restar latencia si corresponde (en minutos)
        const latenciaHoras = registro.latenciaMin / 60;
        const horasSuenoCalculadas = duracionHoras - latenciaHoras;
        // Validar razonabilidad: sueño entre 0 y 24 horas
        if (!isNaN(horasSuenoCalculadas) && horasSuenoCalculadas >= 0 && horasSuenoCalculadas <= 24) {
          horasSueno = horasSuenoCalculadas;
        }

        // Calcular cafeína residual histórica usando la hora real de acostarse
        const instanteEvaluacion = horaAcostarse.getTime() / 3600000; // horas desde epoch

        // Filtrar solo ingestas anteriores al instante de evaluación
        const ingestasAnteriores = ingestasDominio.filter(
          (ing) => ing.hora <= instanteEvaluacion,
        );

        if (ingestasAnteriores.length > 0) {
          const residualMg = residual(
            ingestasAnteriores,
            instanteEvaluacion,
            SEMIVIDA_H_DEFECTO,
          );
          cafeinaResidual = Number(residualMg.toFixed(1));
        } else if (Number.isFinite(instanteEvaluacion)) {
          cafeinaResidual = 0;
        }
      }

      // Determinar adherencia: contar notificaciones abiertas del día
      // Lima es UTC-5 sin horario de verano; consultar instantes, no claves del diario.
      const inicioDia = new Date(`${fechaStr}T00:00:00-05:00`);
      const finDia = new Date(inicioDia);
      finDia.setUTCDate(finDia.getUTCDate() + 1);

      const notificacionesAbiertas =
        await this.prisma.notificacion.count({
          where: {
            id_usuario: idUsuario,
            abierta: true,
            programada_para: {
              gte: inicioDia,
              lt: finDia,
            },
          },
        });

      resultado.push({
        fecha: fechaStr,
        horasSueno,
        cafeinaResidual,
        diarioRegistrado: registro !== undefined,
        notificacionesAbiertas,
      });
    }

    return { dias: resultado };
  }

  /**
   * Formatea una fecha a YYYY-MM-DD en zona UTC.
   */
  private formatearFechaISO(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}