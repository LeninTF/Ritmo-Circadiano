import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TURNO_ASIGNADO, type TurnoAsignadoEvento } from '@circadiano/contracts';
import { OperacionesService } from '../operaciones/operaciones.service';
import { PlanesService } from './planes.service';

/** Regenera el plan cuando I2 asigna un turno o I5 lo corrige. */
@Injectable()
export class TurnoAsignadoListener {
  private readonly logger = new Logger(TurnoAsignadoListener.name);

  constructor(
    private readonly operaciones: OperacionesService,
    private readonly planes: PlanesService,
  ) {}

  @OnEvent(TURNO_ASIGNADO, { async: true })
  async regenerarPlan({ idTurno }: TurnoAsignadoEvento): Promise<void> {
    try {
      await this.planes.generarParaTurno(await this.operaciones.obtenerTurnoPorId(idTurno));
    } catch (error) {
      // Sin datos de sueno ni cafeina en el log (CLAUDE.md §6); el plan se puede generar luego a pedido.
      this.logger.warn(`No se pudo regenerar el plan del turno ${idTurno}: ${(error as Error).name}`);
    }
  }
}
