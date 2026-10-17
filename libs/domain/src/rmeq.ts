/**
 * rmeq.ts — Clasificación del cronotipo mediante el rMEQ de 5 ítems (RN07).
 *
 * Funciones PURAS: no leen Date.now(), no tienen I/O, no dependen de frameworks.
 * Importadas por `libs/domain/src/circadiano.ts` y directamente por la PWA offline.
 */
import type { CategoriaCronotipo } from '@circadiano/contracts';
import {
  CATEGORIA_RMEQ_SIN_RESPUESTA,
  RANGOS_RMEQ,
  RMEQ_PUNTAJE_MAX,
  RMEQ_PUNTAJE_MIN,
} from './constantes';

// ─── Tipos públicos ─────────────────────────────────────────────────────────

/**
 * Respuestas a los 5 ítems del cuestionario rMEQ.
 * Cada ítem devuelve un número entero en su propio rango (ver CLAUDE.md § RN07).
 * La suma total debe quedar en [4, 25].
 */
export interface RespuestasRmeq {
  /** Ítem 1: ¿A qué hora te levantarías si pudieras? (1–5) */
  p1: number;
  /** Ítem 2: ¿A qué hora te acostarías si pudieras? (1–5) */
  p2: number;
  /** Ítem 3: ¿Depende del despertador para levantarte? (1–4) */
  p3: number;
  /** Ítem 4: ¿Qué tan fácil te resulta levantarte? (1–5) */
  p4: number;
  /** Ítem 5: ¿Cuándo te sientes más activo? (1–6)  */
  p5: number;
}

// ─── Suma de respuestas ──────────────────────────────────────────────────────

/**
 * Suma los valores de los 5 ítems del rMEQ y devuelve el puntaje total.
 * El resultado se clampea al rango válido [4, 25] para tolerar entradas
 * fuera de rango sin lanzar excepción (la validación de negocio va en el DTO).
 *
 * @param respuestas Objeto con las 5 respuestas del cuestionario.
 * @returns Puntaje total en el rango [4, 25].
 */
export function sumarRespuestasRmeq(respuestas: RespuestasRmeq): number {
  const total = respuestas.p1 + respuestas.p2 + respuestas.p3 + respuestas.p4 + respuestas.p5;
  return Math.max(RMEQ_PUNTAJE_MIN, Math.min(RMEQ_PUNTAJE_MAX, total));
}

// ─── Clasificación ───────────────────────────────────────────────────────────

/**
 * Clasifica el cronotipo según el puntaje rMEQ (RN07).
 *
 * | Puntaje | Categoría              |
 * |---------|------------------------|
 * | 4–7     | vespertino_definido    |
 * | 8–11    | vespertino_moderado    |
 * | 12–17   | intermedio             |
 * | 18–21   | matutino_moderado      |
 * | 22–25   | matutino_definido      |
 *
 * Si el puntaje está fuera del rango [4, 25] devuelve `intermedio`
 * (regla de defecto RN07).
 *
 * @param puntaje  Suma de las 5 respuestas del rMEQ.
 * @returns        Categoría de cronotipo.
 */
export function clasificarCronotipo(puntaje: number): CategoriaCronotipo {
  const rango = RANGOS_RMEQ.find((r) => puntaje >= r.min && puntaje <= r.max);
  return rango?.categoria ?? CATEGORIA_RMEQ_SIN_RESPUESTA;
}

/**
 * Conveniencia: a partir de las respuestas crudas devuelve directamente
 * la categoría sin que el llamador deba pasar por `sumarRespuestasRmeq`.
 *
 * @param respuestas Respuestas del cuestionario de 5 ítems.
 * @returns          Categoría de cronotipo derivada.
 */
export function clasificarCronotipoDesdeRespuestas(
  respuestas: RespuestasRmeq,
): CategoriaCronotipo {
  return clasificarCronotipo(sumarRespuestasRmeq(respuestas));
}
