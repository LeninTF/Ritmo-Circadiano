export type { ConfirmacionTurnoPayload, EstadoConfirmacionContrato } from '@circadiano/contracts';

export type EstadoVistaTurno =
  | 'cargando'
  | 'sin_turno'
  | 'pendiente'
  | 'confirmado'
  | 'corregido'
  | 'error';
