import type { CategoriaCronotipo } from './cronotipo';

// Todas las horas viajan como ISO 8601 (UTC): es lo que llega por JSON y lo que guarda Dexie.

/** Bloque de tiempo con inicio y fin. */
export interface VentanaTemporalDto {
  inicio: string;
  fin: string;
}

export type TipoTurnoPlan = 'diurno' | 'nocturno';

export type TipoRecordatorioPlan = 'luz' | 'corte_cafeina' | 'relajacion' | 'dormir';

/** Recordatorio derivado del plan (RF07); I4 lo programa como notificacion (RF10). */
export interface RecordatorioDelPlan {
  tipo: TipoRecordatorioPlan;
  programadaPara: string;
}

/** Plan circadiano diario (RF07, RN04-RN08). Lo consumen I4 (RF09, RF10) e I5 (RF11). */
export interface PlanDiarioDto {
  id: string;
  idTurno: string | null;
  /** Fecha del turno, YYYY-MM-DD. */
  fecha: string;
  tipoTurno: TipoTurnoPlan;
  inicioSueno: string;
  finSueno: string;
  /** Siesta de 90 min cuando el sueno principal no llega a 7 h (RN06). */
  inicioSiesta: string | null;
  finSiesta: string | null;
  picos: VentanaTemporalDto[];
  /** min(RN04, dormir - 6 h); null = no tomar mas cafeina ese dia. */
  horaCorteCafeina: string | null;
  /** Diurno: buscar luz natural. Nocturno (protegerLuz): evitar luz intensa. Null si no hay luz de dia. */
  ventanaLuz: VentanaTemporalDto | null;
  protegerLuz: boolean;
  categoriaCronotipo: CategoriaCronotipo;
  versionAlgoritmo: string;
  recordatorios: RecordatorioDelPlan[];
  actualizadoEn: string;
}

/** Body de POST /planes/generar. El usuario sale del token, nunca del body. */
export interface GenerarPlanDto {
  idTurno: string;
}

/** Body de POST /ubicacion (RF06). */
export interface CrearUbicacionDto {
  lat: number;
  lng: number;
  /** Ciudad elegida o "Ubicación actual" si vino del GPS. */
  origen: string;
}

export interface UbicacionDto extends CrearUbicacionDto {
  id: string;
  zonaHoraria: string;
}

/** Amanecer, mediodia solar y atardecer de un dia (RF06, CP-06). */
export interface EventoSolarDto {
  fecha: string;
  amanecer: string;
  mediodia: string;
  atardecer: string;
}

export const ZONA_HORARIA_EMPRESA = 'America/Lima';

export interface SedeEmpresa {
  nombre: string;
  lat: number;
  lng: number;
}

/** Sedes para el respaldo manual cuando no hay permiso de ubicacion (RF06). Ica es la sede por defecto. */
export const SEDES_EMPRESA: readonly SedeEmpresa[] = [
  { nombre: 'Ica', lat: -14.0689, lng: -75.7222 },
  { nombre: 'Nasca', lat: -14.8292, lng: -74.9386 },
  { nombre: 'Palpa', lat: -14.5336, lng: -75.1856 },
  { nombre: 'Acarí', lat: -15.4311, lng: -74.6156 },
  { nombre: 'Lima', lat: -12.0464, lng: -77.0428 },
];
