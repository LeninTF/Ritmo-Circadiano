export const TURNO_ASIGNADO = 'TurnoAsignado';

/** I2 (e I5 al corregir turno) lo emite; I3 regenera el plan. */
export interface TurnoAsignadoEvento {
  idTurno: string;
  idUsuario: string;
  /** Fecha del turno en formato ISO (AAAA-MM-DD). */
  fecha: string;
}
