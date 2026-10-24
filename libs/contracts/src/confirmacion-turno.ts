export type EstadoConfirmacionContrato = 'pendiente' | 'confirmado' | 'corregido';

export interface ConfirmacionTurnoPayload {
  estadoConfirmacion: EstadoConfirmacionContrato;
  horaInicioReal?: string | null;
  horaFinReal?: string | null;
}
