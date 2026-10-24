/**
 * circadiano.ts — Motor de generación del plan circadiano diario (RF07).
 *
 * Función PURA: recibe todos los parámetros como argumentos, no llama a
 * Date.now() ni a ninguna API externa. La PWA (offline) y la API ejecutan
 * exactamente este código.
 *
 * Reglas: RN04 + RN05 (corte de cafeína), RN06 (sueño y siesta), RN07 (cronotipo), RN08 (luz).
 */
import type {
  CategoriaCronotipo,
  RecordatorioDelPlan,
  TipoTurnoPlan,
} from '@circadiano/contracts';
import { calcularHoraCorte, type IngestaCafeina } from './cafeina';
import {
  DOSIS_REFERENCIA_CORTE_MG,
  OPORTUNIDAD_SUENO_MIN_H,
  SIESTA_DURACION_MIN,
  SIESTA_FIN_ANTES_TURNO_MIN,
} from './constantes';
import type { EventosSolares } from './solar';

/** Minutos antes del inicio del turno en que despierta el conductor (diurno). */
const DESPERTAR_ANTES_TURNO_MIN = 90;
/** Horas de sueño objetivo (5 ciclos de 90 min). */
const SUENO_OBJETIVO_H = 7.5;
/** Tras un turno nocturno se duerme 60 min después de terminar. */
const DORMIR_TRAS_NOCTURNO_MIN = 60;
/** Ajuste de horario por cronotipo en minutos (±30 min, solo diurno). */
const AJUSTE_CRONOTIPO_MIN = 30;
/** Primer pico: despertar + 2 h → + 4 h. */
const PICO1_INICIO_H = 2;
const PICO1_FIN_H = 4;
/** Pico de tarde (diurno): mediodía solar + 1 h → + 3 h. */
const PICO_TARDE_INICIO_H = 1;
const PICO_TARDE_FIN_H = 3;
/** Pico de tarde (nocturno): despertar + 5 h → + 7 h. */
const PICO2_NOCTURNO_INICIO_H = 5;
const PICO2_NOCTURNO_FIN_H = 7;
const VENTANA_LUZ_MIN = 60;
const RELAJACION_ANTES_DORMIR_MIN = 30;

const MS_POR_H = 3_600_000;

export interface Ventana {
  inicio: Date;
  fin: Date;
}

/** Turno para el que se genera el plan. */
export interface ParametrosTurno {
  inicioTurno: Date;
  finTurno: Date;
  /** RN01: `turno_laboral.es_nocturno` o `detectarTurnoNocturno()`. */
  esNocturno: boolean;
  /** Inicio del siguiente turno; limita el sueño tras un turno nocturno (RN06). */
  inicioSiguienteTurno?: Date | null;
}

/** Configuración inyectada (parametro_sistema y usuario.semivida_h). */
export interface ConfiguracionMotor {
  versionAlgoritmo: string;
  semividaH: number;
  umbralCafeinaMg: number;
}

/** Resultado del motor listo para persistir y serializar. */
export interface ResultadoPlan {
  tipoTurno: TipoTurnoPlan;
  inicioSueno: Date;
  finSueno: Date;
  inicioSiesta: Date | null;
  finSiesta: Date | null;
  picos: Ventana[];
  /** null = la cafeína previa ya llena el umbral: no tomar más (RN04). */
  horaCorteCafeina: Date | null;
  ventanaLuz: Ventana | null;
  /** true tras turno nocturno: la ventana es para evitar luz intensa (RN08). */
  protegerLuz: boolean;
  categoriaCronotipo: CategoriaCronotipo;
  versionAlgoritmo: string;
}

function addMin(fecha: Date, minutos: number): Date {
  return new Date(fecha.getTime() + minutos * 60_000);
}

function addH(fecha: Date, horas: number): Date {
  return addMin(fecha, horas * 60);
}

function minDate(a: Date, b: Date): Date {
  return a.getTime() <= b.getTime() ? a : b;
}

function maxDate(a: Date, b: Date): Date {
  return a.getTime() >= b.getTime() ? a : b;
}

/** Diferencia en horas (b − a). */
function diffH(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / MS_POR_H;
}

const DELTA_CRONOTIPO_MIN: Record<CategoriaCronotipo, number> = {
  vespertino_definido: AJUSTE_CRONOTIPO_MIN,
  vespertino_moderado: AJUSTE_CRONOTIPO_MIN,
  intermedio: 0,
  matutino_moderado: -AJUSTE_CRONOTIPO_MIN,
  matutino_definido: -AJUSTE_CRONOTIPO_MIN,
};

/** RN04 + RN05 sobre el reloj en horas que usa cafeina.ts. */
function calcularCorteCafeina(
  dormir: Date,
  ingestas: readonly IngestaCafeina[],
  cfg: ConfiguracionMotor,
): Date | null {
  const corteH = calcularHoraCorte(
    DOSIS_REFERENCIA_CORTE_MG,
    dormir.getTime() / MS_POR_H,
    ingestas,
    cfg.semividaH,
    cfg.umbralCafeinaMg,
  );
  return corteH === null ? null : new Date(corteH * MS_POR_H);
}

/**
 * Genera el plan circadiano de un turno.
 *
 * **Diurno**: despertar = inicio − 90 min (±30 por cronotipo); sueño de 7,5 h antes;
 * luz natural `[max(despertar, amanecer), +60 min]` recortada al atardecer (RN08).
 *
 * **Nocturno**: sueño desde fin + 60 min, 7,5 h o hasta 60 min antes del siguiente turno.
 * Si no llega a 7 h, siesta de 90 min que termina 60 min antes de este turno (RN06).
 * Entre el fin del turno y el sueño: proteger de luz intensa (RN08).
 *
 * @param ingestas Ingestas de cafeína previas, en horas (`hora = ms / 3 600 000`).
 */
export function generarPlan(
  turno: ParametrosTurno,
  cronotipo: CategoriaCronotipo,
  solar: EventosSolares,
  ingestas: readonly IngestaCafeina[],
  cfg: ConfiguracionMotor,
): ResultadoPlan {
  const parcial = turno.esNocturno
    ? planNocturno(turno)
    : planDiurno(turno, cronotipo, solar);
  return {
    ...parcial,
    horaCorteCafeina: calcularCorteCafeina(parcial.inicioSueno, ingestas, cfg),
    categoriaCronotipo: cronotipo,
    versionAlgoritmo: cfg.versionAlgoritmo,
  };
}

type PlanParcial = Omit<ResultadoPlan, 'horaCorteCafeina' | 'categoriaCronotipo' | 'versionAlgoritmo'>;

function planDiurno(
  turno: ParametrosTurno,
  cronotipo: CategoriaCronotipo,
  solar: EventosSolares,
): PlanParcial {
  const despertar = addMin(turno.inicioTurno, -DESPERTAR_ANTES_TURNO_MIN + DELTA_CRONOTIPO_MIN[cronotipo]);
  const inicioLuz = maxDate(despertar, solar.amanecer);
  const finLuz = minDate(addMin(inicioLuz, VENTANA_LUZ_MIN), solar.atardecer);

  return {
    tipoTurno: 'diurno',
    inicioSueno: addH(despertar, -SUENO_OBJETIVO_H),
    finSueno: despertar,
    inicioSiesta: null,
    finSiesta: null,
    picos: [
      { inicio: addH(despertar, PICO1_INICIO_H), fin: addH(despertar, PICO1_FIN_H) },
      { inicio: addH(solar.mediodia, PICO_TARDE_INICIO_H), fin: addH(solar.mediodia, PICO_TARDE_FIN_H) },
    ],
    ventanaLuz: inicioLuz.getTime() < finLuz.getTime() ? { inicio: inicioLuz, fin: finLuz } : null,
    protegerLuz: false,
  };
}

function planNocturno(turno: ParametrosTurno): PlanParcial {
  const inicioSueno = addMin(turno.finTurno, DORMIR_TRAS_NOCTURNO_MIN);
  let finSueno = addH(inicioSueno, SUENO_OBJETIVO_H);
  if (turno.inicioSiguienteTurno) {
    const limite = addMin(turno.inicioSiguienteTurno, -SIESTA_FIN_ANTES_TURNO_MIN);
    finSueno = maxDate(inicioSueno, minDate(finSueno, limite));
  }

  // RN06: si el sueño principal no llega a 7 h, siesta antes de este turno.
  const necesitaSiesta = diffH(inicioSueno, finSueno) < OPORTUNIDAD_SUENO_MIN_H;
  const finSiesta = necesitaSiesta ? addMin(turno.inicioTurno, -SIESTA_FIN_ANTES_TURNO_MIN) : null;

  const picos: Ventana[] = [
    { inicio: addH(finSueno, PICO1_INICIO_H), fin: addH(finSueno, PICO1_FIN_H) },
  ];
  const pico2 = { inicio: addH(finSueno, PICO2_NOCTURNO_INICIO_H), fin: addH(finSueno, PICO2_NOCTURNO_FIN_H) };
  if (!turno.inicioSiguienteTurno || pico2.fin.getTime() <= turno.inicioSiguienteTurno.getTime()) {
    picos.push(pico2);
  }

  return {
    tipoTurno: 'nocturno',
    inicioSueno,
    finSueno,
    inicioSiesta: finSiesta && addMin(finSiesta, -SIESTA_DURACION_MIN),
    finSiesta,
    picos,
    ventanaLuz: { inicio: turno.finTurno, fin: inicioSueno },
    protegerLuz: true,
  };
}

/** Convierte el plan en recordatorios para las notificaciones de I4 (RF10). */
export function derivarRecordatorios(plan: ResultadoPlan): RecordatorioDelPlan[] {
  const recordatorios: RecordatorioDelPlan[] = [];
  if (plan.ventanaLuz && !plan.protegerLuz) {
    recordatorios.push({ tipo: 'luz', programadaPara: plan.ventanaLuz.inicio.toISOString() });
  }
  if (plan.horaCorteCafeina) {
    recordatorios.push({ tipo: 'corte_cafeina', programadaPara: plan.horaCorteCafeina.toISOString() });
  }
  recordatorios.push(
    { tipo: 'relajacion', programadaPara: addMin(plan.inicioSueno, -RELAJACION_ANTES_DORMIR_MIN).toISOString() },
    { tipo: 'dormir', programadaPara: plan.inicioSueno.toISOString() },
  );
  return recordatorios;
}
