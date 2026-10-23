import type { ColorSemaforo } from '@circadiano/contracts';
import {
  SEMAFORO_AMBAR_MIN_H,
  SEMAFORO_ROJO_SOMNOLENCIA_MIN,
  SEMAFORO_VERDE_MIN_H,
} from './constantes';

/**
 * Autorreporte de somnolencia del slider pre-salida (5 pasos, 1 a 5).
 * El umbral rojo (>= 4) sigue pendiente de validacion: la Tabla 22 del
 * informe no lo fija; se conserva el criterio provisional de RN09.
 */
export const SOMNOLENCIA_MIN = 1;
export const SOMNOLENCIA_MAX = 5;

export interface EntradaAptitudPresalida {
  horasSueno24h: number;
  somnolencia: number;
}

export interface ResultadoAptitudPresalida {
  color: ColorSemaforo;
  /**
   * Motivos del color. Rojo tiene prioridad y puede acumular ambos.
   * No es un diagnostico medico ni autoriza conducir o salir.
   */
  motivos: readonly ('sueno_insuficiente' | 'somnolencia_elevada' | 'sueno_intermedio' | 'sueno_suficiente')[];
  /** El calculo no depende del consentimiento. */
  compartido: false;
  /**
   * Aviso fijo: herramienta preventiva de apoyo. No reemplaza la evaluacion
   * medica ni autoriza la salida.
   */
  esApoyoPreventivo: true;
}

export class AptitudPresalidaInvalidaError extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'AptitudPresalidaInvalidaError';
  }
}

function exigirFinito(valor: number, campo: string): void {
  if (typeof valor !== 'number' || !Number.isFinite(valor)) {
    throw new AptitudPresalidaInvalidaError(`${campo} debe ser un numero finito`);
  }
}

/**
 * Semaforo RN09. Funcion pura: no lee el reloj, no consulta consentimiento
 * y no muta la entrada. El rojo tiene prioridad sobre ambar y verde.
 *
 * - rojo: horasSueno24h < 5, o somnolencia >= 4
 * - ambar: 5 <= horasSueno24h < 7, sin condicion roja
 * - verde: horasSueno24h >= 7, sin condicion roja
 */
export function calcularAptitudPresalida(
  entrada: EntradaAptitudPresalida,
): ResultadoAptitudPresalida {
  exigirFinito(entrada.horasSueno24h, 'horasSueno24h');
  exigirFinito(entrada.somnolencia, 'somnolencia');

  if (entrada.horasSueno24h < 0) {
    throw new AptitudPresalidaInvalidaError('horasSueno24h no puede ser negativa');
  }
  if (entrada.horasSueno24h > 24) {
  throw new AptitudPresalidaInvalidaError(
    'horasSueno24h no puede superar 24',
  );
}
  if (
    !Number.isInteger(entrada.somnolencia) ||
    entrada.somnolencia < SOMNOLENCIA_MIN ||
    entrada.somnolencia > SOMNOLENCIA_MAX
  ) {
    throw new AptitudPresalidaInvalidaError(
      `somnolencia debe ser un entero entre ${SOMNOLENCIA_MIN} y ${SOMNOLENCIA_MAX}`,
    );
  }

  const suenoInsuficiente = entrada.horasSueno24h < SEMAFORO_AMBAR_MIN_H;
  const somnolenciaElevada = entrada.somnolencia >= SEMAFORO_ROJO_SOMNOLENCIA_MIN;

  if (suenoInsuficiente || somnolenciaElevada) {
    const motivos: ResultadoAptitudPresalida['motivos'][number][] = [];
    if (suenoInsuficiente) motivos.push('sueno_insuficiente');
    if (somnolenciaElevada) motivos.push('somnolencia_elevada');
    return {
      color: 'rojo',
      motivos,
      compartido: false,
      esApoyoPreventivo: true,
    };
  }

  if (entrada.horasSueno24h < SEMAFORO_VERDE_MIN_H) {
    return {
      color: 'ambar',
      motivos: ['sueno_intermedio'],
      compartido: false,
      esApoyoPreventivo: true,
    };
  }

  return {
    color: 'verde',
    motivos: ['sueno_suficiente'],
    compartido: false,
    esApoyoPreventivo: true,
  };
}

/**
 * RN10: el despachador solo puede ver el color, y solo con consentimiento
 * explicito. Un valor ausente o distinto de true no se trata como consentimiento.
 * No devuelve horas de sueno ni somnolencia.
 */
export function colorDivulgableAlDespachador(
  color: ColorSemaforo,
  compartido: boolean | null | undefined,
): ColorSemaforo | null {
  if (compartido !== true) return null;
  return color;
}
