import { ConfigService } from '@nestjs/config';
import { CafeinaService } from '../cafeina/cafeina.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ParametrosService } from '../plataforma/parametros/parametros.service';
import { HistorialService } from './historial.service';
import { DiarioService } from '../trabajador/diario.service';

describe('RF15 consultas de rango reales entre servicios', () => {
  it('acota cafeína a 48 h previas y hace una única consulta de notificaciones', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-10-20T18:00:00Z'));
    try {
      const ingestas = jest.fn().mockResolvedValue([]);
      const notificaciones = jest.fn().mockResolvedValue([
        { programada_para: new Date('2026-10-14T04:59:59Z') },
        { programada_para: new Date('2026-10-14T05:00:00Z') },
        { programada_para: new Date('2026-10-20T04:59:59Z') },
        { programada_para: new Date('2026-10-20T05:00:00Z') },
        { programada_para: new Date('2026-10-21T05:00:00Z') },
      ]);
      const prisma = { ingestaCafeina: { findMany: ingestas },
        notificacion: { findMany: notificaciones } } as unknown as PrismaService;
      const service = new HistorialService(
        { consultarDiarios: jest.fn().mockResolvedValue([
          { fecha: '2026-10-19', horaAcostarse: '2026-10-19T22:00:00Z',
            horaDespertar: '2026-10-20T06:00:00Z', latenciaMin: 30 },
          { fecha: '2026-10-20', horaAcostarse: '2026-10-20T22:00:00Z',
            horaDespertar: '2026-10-21T06:00:00Z', latenciaMin: 0 },
        ]) } as unknown as DiarioService,
        new CafeinaService(prisma, {} as ParametrosService),
        new NotificacionesService(prisma, new ConfigService()),
      );
      const { dias } = await service.getHistorial('yo', 7);
      expect(ingestas).toHaveBeenCalledTimes(1);
      expect(ingestas).toHaveBeenCalledWith({
        where: { id_usuario: 'yo', fecha_hora: {
          gte: new Date('2026-10-17T22:00:00Z'), lte: new Date('2026-10-20T22:00:00Z'),
        } }, select: { cafeina_mg: true, fecha_hora: true }, orderBy: { fecha_hora: 'asc' },
      });
      expect(notificaciones).toHaveBeenCalledTimes(1);
      expect(notificaciones).toHaveBeenCalledWith({ where: {
        id_usuario: 'yo', abierta: true, programada_para: {
          gte: new Date('2026-10-14T05:00:00Z'), lt: new Date('2026-10-21T05:00:00Z'),
        },
      }, select: { programada_para: true } });
      expect(dias.map((d) => d.notificacionesAbiertas)).toEqual([1, 0, 0, 0, 0, 1, 1]);
      expect(dias[5].horasSueno).toBe(7.5);
    } finally {
      jest.useRealTimers();
    }
  });
});
