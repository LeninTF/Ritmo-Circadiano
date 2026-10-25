import type { NotificacionesService } from '../notificaciones/notificaciones.service';
import { TurnoAsignadoNotificacionListener } from './turno-asignado-notificacion.listener';

describe('TurnoAsignadoNotificacionListener (RF05)', () => {
  it('encola un aviso de tipo turno para el trabajador asignado', async () => {
    const encolar = jest.fn().mockResolvedValue({});
    const listener = new TurnoAsignadoNotificacionListener({ encolar } as unknown as NotificacionesService);

    await listener.avisarTurno({ idTurno: 't-1', idUsuario: 'u-1', fecha: '2026-10-25' });

    expect(encolar).toHaveBeenCalledWith({
      id_usuario: 'u-1',
      tipo: 'turno',
      programada_para: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
    });
  });
});
