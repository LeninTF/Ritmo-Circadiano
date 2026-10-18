import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CircadianoService } from '../services/circadiano.service';
import { TURNO_ASIGNADO } from '@circadiano/contracts';
import { GenerarPlanDto } from '@circadiano/contracts';

@Injectable()
export class OnTurnoAsignadoHandler {
  constructor(private readonly circadianoService: CircadianoService) {}

  @OnEvent(TURNO_ASIGNADO)
  async handleTurnoAsignado(payload: { idTurno: string; idUsuario: string; fecha: string }) {
    const dto: GenerarPlanDto = {
      idUsuario: payload.idUsuario,
      fecha: payload.fecha,
      idTurno: payload.idTurno,
    };
    await this.circadianoService.generarPlanParaUsuario(dto);
  }
}
