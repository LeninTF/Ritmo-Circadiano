import type { CategoriaCronotipo } from '@circadiano/contracts';

// RN01 · conduccion continua
export const CONDUCCION_MAX_NOCTURNA_H = 4;
export const CONDUCCION_MAX_DIURNA_H = 5;
export const CONDUCCION_MAX_ACUMULADA_H = 10;
export const CONDUCCION_VENTANA_H = 24;
/** Tramo nocturno: 22:00 a 05:59, es decir hora >= 22 u hora < 6. */
export const HORA_INICIO_NOCTURNO = 22;
export const HORA_FIN_NOCTURNO = 6;

// RN02 · umbral de cafeina residual al dormir (criterio de diseno, no clinico)
export const UMBRAL_CAFEINA_MG_DEFECTO = 50;

// RN03 · semivida de la cafeina
export const SEMIVIDA_H_DEFECTO = 5;
export const SEMIVIDA_H_FUMADOR = 3;
export const SEMIVIDA_H_METABOLIZADOR_LENTO = 8;

// RN05 · el corte final nunca pasa de dormir - 6 h
export const CORTE_CAFEINA_ANTES_DORMIR_H = 6;

// RN06 · oportunidad de sueno
export const OPORTUNIDAD_SUENO_MIN_H = 7;
export const SIESTA_DURACION_MIN = 90;
export const SIESTA_FIN_ANTES_TURNO_MIN = 60;

// RN07 · rMEQ de 5 items
export const RMEQ_PUNTAJE_MIN = 4;
export const RMEQ_PUNTAJE_MAX = 25;
export const CATEGORIA_RMEQ_SIN_RESPUESTA: CategoriaCronotipo = 'intermedio';

export interface RangoRmeq {
  categoria: CategoriaCronotipo;
  min: number;
  max: number;
}

export const RANGOS_RMEQ: readonly RangoRmeq[] = [
  { categoria: 'vespertino_definido', min: 4, max: 7 },
  { categoria: 'vespertino_moderado', min: 8, max: 11 },
  { categoria: 'intermedio', min: 12, max: 17 },
  { categoria: 'matutino_moderado', min: 18, max: 21 },
  { categoria: 'matutino_definido', min: 22, max: 25 },
];

// RN09 · semaforo de aptitud (umbral de somnolencia pendiente de validacion)
export const SEMAFORO_VERDE_MIN_H = 7;
export const SEMAFORO_AMBAR_MIN_H = 5;
export const SEMAFORO_ROJO_SOMNOLENCIA_MIN = 4;
