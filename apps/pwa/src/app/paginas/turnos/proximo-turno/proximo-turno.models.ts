import { EstadoConfirmacion, TurnoLaboral } from '@circadiano/domain';

export type EstadoConfirmacionContrato = EstadoConfirmacion;

export interface ConfirmacionTurnoPayload {
  estadoConfirmacion: EstadoConfirmacionContrato;
  horaInicioReal?: string | null;
  horaFinReal?: string | null;
}

export type EstadoVistaTurno =
  | 'cargando'
  | 'sin_turno'
  | 'pendiente'
  | 'confirmado'
  | 'corregido'
  | 'error';

/**
 * Fixture tipada explícitamente para demostración visual y pruebas locales (Fase 4).
 * No representa una llamada HTTP no autenticada al backend.
 */
export const DEMO_PROXIMO_TURNO: TurnoLaboral = {
  id: 'trn-demo-001',
  idUsuario: 'usr-demo-001',
  idRuta: 'ruta-lim-nasca',
  fecha: '2026-10-23',
  inicioProgramado: '2026-10-23T08:00:00Z',
  finProgramado: '2026-10-23T17:00:00Z',
  horasConduccion: 8,
  esNocturno: false,
  estadoConfirmacion: 'pendiente',
  horaInicioReal: null,
  horaFinReal: null,
  creadoEn: '2026-10-22T06:00:00Z',
  actualizadoEn: '2026-10-22T06:00:00Z',
};

export const DEMO_TURNO_NOCTURNO: TurnoLaboral = {
  id: 'trn-demo-002',
  idUsuario: 'usr-demo-001',
  idRuta: 'ruta-lim-ica',
  fecha: '2026-10-23',
  inicioProgramado: '2026-10-23T22:00:00Z',
  finProgramado: '2026-10-24T06:00:00Z',
  horasConduccion: 7,
  esNocturno: true,
  estadoConfirmacion: 'pendiente',
  horaInicioReal: null,
  horaFinReal: null,
  creadoEn: '2026-10-22T06:00:00Z',
  actualizadoEn: '2026-10-22T06:00:00Z',
};
