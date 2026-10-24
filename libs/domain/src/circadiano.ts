/**
 * circadiano.ts — Motor de generación del plan circadiano diario (RF07).
 *
 * Función PURA: recibe todos los parámetros como argumentos, no llama a
 * Date.now() ni a ninguna API externa. Reutilizable en la PWA offline
 * y en el backend sin modificar una sola línea.
 *
 * Reglas implementadas: RN06, RN07, RN08, RN05 (parcial por corte).
 */
import type { CategoriaCronotipo } from '@circadiano/contracts';
import type { VentanaTemporal } from '@circadiano/contracts';
import {
  CORTE_CAFEINA_ANTES_DORMIR_H,
  HORA_FIN_NOCTURNO,
  HORA_INICIO_NOCTURNO,
  OPORTUNIDAD_SUENO_MIN_H,
  SIESTA_DURACION_MIN,
  SIESTA_FIN_ANTES_TURNO_MIN,
} from './constantes';
import type { IngestaCafeina } from './cafeina';
import type { EventosSolares } from './solar';

// ─── Constantes internas del motor ──────────────────────────────────────────

/** Minutos antes del inicio del turno en que debe despertar el conductor (diurno). */
const DESPERTAR_ANTES_TURNO_MIN = 90;
/** Horas de sueño objetivo (5 ciclos de 90 min). */
const SUENO_OBJETIVO_H = 7.5;
/** Ajuste de horario por cronotipo en minutos (±30 min). */
const AJUSTE_CRONOTIPO_MIN = 30;
/** Primer pico: despertar+2 h → +4 h. */
const PICO1_INICIO_H = 2;
const PICO1_FIN_H = 4;
/** Segundo pico: mediodía+1 h → +3 h. */
const PICO2_INICIO_H = 1;
const PICO2_FIN_H = 3;

// ─── Tipos ───────────────────────────────────────────────────────────────────

/** Parámetros de un turno laboral para el motor circadiano. */
export interface ParametrosTurno {
  inicioTurno: Date;
  finTurno: Date;
}

/** Configuración inyectada del sistema. */
export interface ConfiguracionMotor {
  versionAlgoritmo: string;
  semividaH: number;
  umbralCafeinaMg: number;
}

/** Tipo de turno detectado. */
export type TipoTurno = 'diurno' | 'nocturno';

/** Resultado completo del motor listo para persistir y serializar. */
export interface ResultadoPlan {
  inicioSueno: Date;
  finSueno: Date;
  inicioSiesta: Date | null;
  finSiesta: Date | null;
  tipoTurno: TipoTurno;
  picos: VentanaTemporal[];
  horaCorteCalefina: Date;
  ventanaLuz: VentanaTemporal;
  categoriaCronotipo: CategoriaCronotipo;
  versionAlgoritmo: string;
}

// ─── Helpers internos ────────────────────────────────────────────────────────

/** Suma `minutos` a una fecha (inmutable). */
function addMin(fecha: Date, minutos: number): Date {
  return new Date(fecha.getTime() + minutos * 60_000);
}

/** Suma `horas` a una fecha (inmutable). */
function addH(fecha: Date, horas: number): Date {
  return addMin(fecha, horas * 60);
}

/** Devuelve el menor de dos Date. */
function minDate(a: Date, b: Date): Date {
  return a.getTime() <= b.getTime() ? a : b;
}

/** Devuelve el mayor de dos Date. */
function maxDate(a: Date, b: Date): Date {
  return a.getTime() >= b.getTime() ? a : b;
}

/** Diferencia en horas entre dos fechas (b − a). */
function diffH(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / 3_600_000;
}

/**
 * Nocturno: hora local Lima (UTC-5) ≥ 22 o < 6.
 * Las fechas del turno llegan en UTC; restamos 5 h para obtener hora local.
 */
function esTurnoNocturno(inicioTurno: Date): boolean {
  const horaLocal = (inicioTurno.getUTCHours() - 5 + 24) % 24;
  return horaLocal >= HORA_INICIO_NOCTURNO || horaLocal < HORA_FIN_NOCTURNO;
}


/** Ajusta ±30 min según cronotipo (vespertino → tarde; matutino → temprano). */
function ajustarPorCronotipo(fecha: Date, categoria: CategoriaCronotipo): Date {
  const delta: Record<CategoriaCronotipo, number> = {
    vespertino_definido: +AJUSTE_CRONOTIPO_MIN,
    vespertino_moderado: +AJUSTE_CRONOTIPO_MIN,
    intermedio: 0,
    matutino_moderado: -AJUSTE_CRONOTIPO_MIN,
    matutino_definido: -AJUSTE_CRONOTIPO_MIN,
  };
  return addMin(fecha, delta[categoria]);
}

// ─── Motor principal ─────────────────────────────────────────────────────────

/**
 * Genera el plan circadiano diario para un conductor.
 *
 * **Diurno** (inicio local 06:00–21:59):
 * - `despertar = inicioTurno − 90 min` (ajustado ±30 min por cronotipo).
 * - `inicioSueno = despertar − 7.5 h`.
 * - Luz: `[max(despertar, amanecer), +60 min]` (RN08).
 *
 * **Nocturno** (inicio local 22:00–05:59):
 * - `inicioSueno = finTurno + 60 min`.
 * - Si hueco < 7 h antes del siguiente turno → añade siesta 90 min
 *   que termina ≥ 60 min antes del turno (RN06).
 * - Luz: ventana de protección `[finTurno, inicioSueno]` (RN08).
 */
export function generarPlan(
  turno: ParametrosTurno,
  cronotipo: CategoriaCronotipo,
  solar: EventosSolares,
  _ingestas: IngestaCafeina[],
  cfg: ConfiguracionMotor,
): ResultadoPlan {
  return esTurnoNocturno(turno.inicioTurno)
    ? _planNocturno(turno, cronotipo, solar, cfg)
    : _planDiurno(turno, cronotipo, solar, cfg);
}

// ─── Plan diurno ─────────────────────────────────────────────────────────────

function _planDiurno(
  turno: ParametrosTurno,
  cronotipo: CategoriaCronotipo,
  solar: EventosSolares,
  cfg: ConfiguracionMotor,
): ResultadoPlan {
  const despertar = ajustarPorCronotipo(
    addMin(turno.inicioTurno, -DESPERTAR_ANTES_TURNO_MIN),
    cronotipo,
  );
  const finSueno = despertar;
  // El inicio del sueño se calcula a partir del despertar ya ajustado, sin segundo ajuste.
  const inicioSueno = addH(despertar, -SUENO_OBJETIVO_H);

  const picos: VentanaTemporal[] = [
    { inicio: addH(despertar, PICO1_INICIO_H), fin: addH(despertar, PICO1_FIN_H) },
    { inicio: addH(solar.mediodia, PICO2_INICIO_H), fin: addH(solar.mediodia, PICO2_FIN_H) },
  ];

  const horaCorteCalefina = addH(inicioSueno, -CORTE_CAFEINA_ANTES_DORMIR_H);

  const inicioLuz = maxDate(despertar, solar.amanecer);
  const ventanaLuz: VentanaTemporal = { inicio: inicioLuz, fin: addH(inicioLuz, 1) };

  return {
    inicioSueno,
    finSueno,
    inicioSiesta: null,
    finSiesta: null,
    tipoTurno: 'diurno',
    picos,
    horaCorteCalefina,
    ventanaLuz,
    categoriaCronotipo: cronotipo,
    versionAlgoritmo: cfg.versionAlgoritmo,
  };
}


// ─── Plan nocturno ────────────────────────────────────────────────────────────

function _planNocturno(
  turno: ParametrosTurno,
  cronotipo: CategoriaCronotipo,
  solar: EventosSolares,
  cfg: ConfiguracionMotor,
): ResultadoPlan {
  const inicioSueno = ajustarPorCronotipo(addH(turno.finTurno, 1), cronotipo);
  const finSuenoIdeal = addH(inicioSueno, SUENO_OBJETIVO_H);

  // Límite: siesta termina ≥ 60 min antes del inicio del siguiente turno.
  const limiteAntesTurno = addMin(turno.inicioTurno, -SIESTA_FIN_ANTES_TURNO_MIN);
  const hueco = diffH(inicioSueno, limiteAntesTurno);

  let finSueno: Date;
  let inicioSiesta: Date | null = null;
  let finSiesta: Date | null = null;

  if (hueco >= OPORTUNIDAD_SUENO_MIN_H) {
    finSueno = finSuenoIdeal;
  } else {
    // No caben 7 h continuas: siesta de 90 min al final del hueco.
    finSiesta = limiteAntesTurno;
    inicioSiesta = addMin(finSiesta, -SIESTA_DURACION_MIN);
    finSueno = inicioSiesta.getTime() > inicioSueno.getTime() ? inicioSiesta : inicioSueno;
  }

  const despertar = finSueno;
  const picos: VentanaTemporal[] = [
    { inicio: addH(despertar, PICO1_INICIO_H), fin: addH(despertar, PICO1_FIN_H) },
  ];
  // Segundo pico sólo si queda antes del inicio del turno.
  const pico2Inicio = addH(despertar, PICO1_FIN_H + PICO2_INICIO_H);
  if (pico2Inicio.getTime() < turno.inicioTurno.getTime()) {
    picos.push({
      inicio: pico2Inicio,
      fin: addH(pico2Inicio, PICO2_FIN_H - PICO2_INICIO_H),
    });
  }

  const horaCorteCalefina = addH(inicioSueno, -CORTE_CAFEINA_ANTES_DORMIR_H);

  // Luz nocturna: proteger de luz intensa entre fin del turno e inicio del sueño (RN08).
  const ventanaLuz: VentanaTemporal = { inicio: turno.finTurno, fin: inicioSueno };

  void solar; // disponible para refinamiento futuro (protección solar precisa)

  return {
    inicioSueno,
    finSueno,
    inicioSiesta,
    finSiesta,
    tipoTurno: 'nocturno',
    picos,
    horaCorteCalefina,
    ventanaLuz,
    categoriaCronotipo: cronotipo,
    versionAlgoritmo: cfg.versionAlgoritmo,
  };
}

// ─── Recordatorios ───────────────────────────────────────────────────────────

/**
 * Deriva los recordatorios push a partir del plan (SRP: el motor calcula,
 * esta función convierte en eventos de calendario para RF10).
 */
export function derivarRecordatorios(
  plan: ResultadoPlan,
): Array<{ tipo: 'luz' | 'corte_cafeina' | 'relajacion' | 'dormir'; programadaPara: Date }> {
  return [
    { tipo: 'luz', programadaPara: plan.ventanaLuz.inicio },
    { tipo: 'corte_cafeina', programadaPara: plan.horaCorteCalefina },
    { tipo: 'relajacion', programadaPara: addMin(plan.inicioSueno, -30) },
    { tipo: 'dormir', programadaPara: plan.inicioSueno },
  ];
}

// Exportar helpers para uso en tests y en la PWA offline.
export { addMin, addH, minDate, maxDate, diffH, esTurnoNocturno };

