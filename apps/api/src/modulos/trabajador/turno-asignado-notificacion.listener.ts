import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TURNO_ASIGNADO, type TurnoAsignadoEvento } from '@circadiano/contracts';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

/** RF05: al publicarse un turno, el trabajador recibe un aviso para confirmarlo o corregirlo. */
@Injectable()
export class TurnoAsignadoNotificacionListener {
  constructor(private readonly notificaciones: NotificacionesService) {}

  @OnEvent(TURNO_ASIGNADO)
  async avisarTurno({ idUsuario }: TurnoAsignadoEvento): Promise<void> {
    // shortcut: el evento no dice quién lo originó, así que una corrección del propio trabajador también avisa; filtrar cuando TurnoAsignado traiga el origen.
    await this.notificaciones.encolar({ id_usuario: idUsuario, tipo: 'turno', programada_para: new Date().toISOString() });
  }
}
