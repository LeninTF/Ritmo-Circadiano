import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { assertKAnonymity } from '@circadiano/domain';
import { RespuestaAgregada } from '@circadiano/contracts';

@Injectable()
export class IndicadoresService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerPanel(desde?: string, hasta?: string): Promise<RespuestaAgregada<any>> {
    const where: any = {};
    if (desde || hasta) {
      where.fecha = {};
      if (desde) {
        where.fecha.gte = new Date(desde);
      }
      if (hasta) {
        where.fecha.lte = new Date(hasta);
      }
    }

    const turnos = await this.prisma.turnoLaboral.findMany({
      where,
      select: {
        idUsuario: true,
        horasConduccion: true,
        esNocturno: true,
      },
    });

    const usuariosUnicos = new Set(turnos.map((t) => t.idUsuario));
    const n = usuariosUnicos.size;

    if (!assertKAnonymity(n, 5)) {
      return { suficiente: false };
    }

    const totalTurnos = turnos.length;
    const totalHorasConduccion = turnos.reduce((acc, t) => acc + Number(t.horasConduccion), 0);
    const promedioHorasConduccion = totalTurnos > 0 ? totalHorasConduccion / totalTurnos : 0;
    const turnosNocturnos = turnos.filter((t) => t.esNocturno).length;

    return {
      suficiente: true,
      datos: {
        conductoresUnicos: n,
        totalTurnos,
        promedioHorasConduccion: Number(promedioHorasConduccion.toFixed(2)),
        turnosNocturnos,
      },
    };
  }
}
