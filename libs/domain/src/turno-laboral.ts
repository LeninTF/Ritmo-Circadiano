/** Estado de confirmacion del turno (ERD05). */
export type EstadoConfirmacion = 'pendiente' | 'confirmado' | 'corregido';

/** Entidad de dominio: turno asignado a un trabajador (RF04, RN01, ERD05). */
export interface TurnoLaboral {
  id: string;
  idUsuario: string;
  idRuta: string;
  /** Fecha del turno (AAAA-MM-DD). */
  fecha: string;
  /** Timestamp ISO del inicio programado. */
  inicioProgramado: string;
  /** Timestamp ISO del fin programado. */
  finProgramado: string;
  /** Horas continuas de conduccion del bloque (RN01). */
  horasConduccion: number;
  /** true si el turno intersecta la franja 22:00–05:59 (RN01). */
  esNocturno: boolean;
  /** Estado de confirmacion del turno (ERD05). */
  estadoConfirmacion: EstadoConfirmacion;
  /** Timestamp ISO del inicio real (ERD05, nullable). */
  horaInicioReal: string | null;
  /** Timestamp ISO del fin real (ERD05, nullable). */
  horaFinReal: string | null;
  creadoEn: string;
  actualizadoEn: string;
}
