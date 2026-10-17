import type { CategoriaCronotipo } from './cronotipo';

// ─── Ventana temporal (inicio + fin) ───────────────────────────────────────

/** Bloque de tiempo con inicio y fin. */
export interface VentanaTemporal {
  inicio: Date;
  fin: Date;
}

// ─── Recordatorio del plan ─────────────────────────────────────────────────

/**
 * Recordatorio puntual derivado del plan circadiano (RF07).
 * El motor genera uno por cada evento relevante del dia.
 */
export interface RecordatorioDelPlan {
  /** Tipo de accion que el trabajador debe realizar. */
  tipo: 'luz' | 'corte_cafeina' | 'relajacion' | 'dormir';
  /** Momento exacto (UTC) en que se debe disparar la notificacion. */
  programadaPara: Date;
}

// ─── DTO principal del plan diario ─────────────────────────────────────────

/**
 * DTO de respuesta del plan circadiano diario (RF07, RN06, RN08).
 * Fuente de verdad compartida entre la API y la PWA.
 * La PWA usa este tipo para pintar la linea de tiempo de 24 h.
 */
export interface PlanDiarioDto {
  id: string;
  idUsuario: string;
  /** Fecha del turno, formato ISO YYYY-MM-DD. */
  fecha: string;

  // ── Bloque de sueno principal ─────────────────────────────────────────────
  /** Inicio del sueno principal (UTC). */
  inicioSueno: Date;
  /** Fin del sueno principal (UTC). */
  finSueno: Date;

  // ── Siesta compensatoria (RN06) ───────────────────────────────────────────
  /** Inicio de la siesta de 90 min si el turno no permite 7 h continuas. */
  inicioSiesta: Date | null;
  /** Fin de la siesta de 90 min. Siempre >= 60 min antes del siguiente turno. */
  finSiesta: Date | null;

  // ── Ventanas de rendimiento ───────────────────────────────────────────────
  /** Bloques de maximo rendimiento cognitivo derivados del cronotipo y el turno. */
  picos: VentanaTemporal[];

  // ── Cafeina (RN04, RN05) ──────────────────────────────────────────────────
  /** Hora maxima para consumir cafeina: min(RN04, inicio_sueno - 6 h). */
  horaCorteCalefina: Date;

  // ── Luz natural (RN08) ────────────────────────────────────────────────────
  /**
   * Ventana de exposicion a luz natural.
   * Diurno: [max(despertar, amanecer), +60 min].
   * Nocturno: campo presente pero marcado como "proteger de luz intensa".
   */
  ventanaLuz: VentanaTemporal;

  /** Cronotipo aplicado para generar este plan. */
  categoriaCronotipo: CategoriaCronotipo;

  /** Version del algoritmo. Cambia con cada modificacion de formulas (OCP). */
  versionAlgoritmo: string;

  /** Recordatorios listos para programar en el scheduler de push (RF10). */
  recordatorios: RecordatorioDelPlan[];

  creadoEn: Date;
  actualizadoEn: Date;
}

// ─── DTO de solicitud de generacion de plan ─────────────────────────────────

/**
 * Body del endpoint POST /planes/generar.
 * Minimo necesario para que el motor circadiano genere el plan.
 */
export interface GenerarPlanDto {
  idUsuario: string;
  /** Fecha del turno, formato ISO YYYY-MM-DD. */
  fecha: string;
  idTurno: string;
}
