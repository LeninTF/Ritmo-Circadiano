import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { assertKAnonymity } from '@circadiano/domain';
import { RespuestaAgregada } from '@circadiano/contracts';

@Injectable()
export class IndicadoresService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerPanel(desde?: string, hasta?: string): Promise<RespuestaAgregada<any>> {
    // Check K-Anonymity using unique drivers in range
    const whereClause = desde && hasta 
      ? `WHERE fecha >= $1::date AND fecha <= $2::date`
      : desde 
      ? `WHERE fecha >= $1::date`
      : hasta 
      ? `WHERE fecha <= $1::date`
      : '';

    const params: any[] = [];
    if (desde && hasta) {
      params.push(desde, hasta);
    } else if (desde || hasta) {
      params.push(desde || hasta);
    }

    const uniqueUsersQuery = `SELECT DISTINCT id_usuario FROM turno_laboral ${whereClause}`;
    const uniqueUsers: any[] = await this.prisma.$queryRawUnsafe(uniqueUsersQuery, ...params);
    const n = uniqueUsers.length;

    if (!assertKAnonymity(n, 5)) {
      return { suficiente: false };
    }

    // Query views v_ind_descanso, v_ind_cafeina, v_ind_adherencia
    const descansoQuery = `SELECT AVG(horas_descanso_previo) as prom_descanso FROM v_ind_descanso ${whereClause}`;
    const cafeinaQuery = `SELECT SUM(CASE WHEN es_nocturno THEN 1 ELSE 0 END) as turnos_nocturnos, AVG(horas_conduccion) as prom_horas FROM v_ind_cafeina ${whereClause}`;
    const adherenciaQuery = `SELECT COUNT(*) as total, SUM(completado) as completados FROM v_ind_adherencia ${whereClause}`;

    const [descansoRes, cafeinaRes, adherenciaRes]: any[] = await Promise.all([
      this.prisma.$queryRawUnsafe(descansoQuery, ...params),
      this.prisma.$queryRawUnsafe(cafeinaQuery, ...params),
      this.prisma.$queryRawUnsafe(adherenciaQuery, ...params),
    ]);

    const promDescanso = Number(descansoRes[0]?.prom_descanso || 0);
    const turnosNocturnos = Number(cafeinaRes[0]?.turnos_nocturnos || 0);
    const promHoras = Number(cafeinaRes[0]?.prom_horas || 0);
    const totalTurnos = Number(adherenciaRes[0]?.total || 0);
    const completados = Number(adherenciaRes[0]?.completados || 0);
    const porcentajeAdherencia = totalTurnos > 0 ? (completados / totalTurnos) * 100 : 0;

    return {
      suficiente: true,
      datos: {
        conductoresUnicos: n,
        totalTurnos,
        promedioHorasConduccion: Number(promHoras.toFixed(2)),
        promedioHorasDescanso: Number(promDescanso.toFixed(2)),
        turnosNocturnos,
        porcentajeAdherencia: Number(porcentajeAdherencia.toFixed(2)),
      },
    };
  }
}

