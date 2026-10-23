import {
  CORTE_CAFEINA_ANTES_DORMIR_H,
  SEMIVIDA_H_DEFECTO,
  UMBRAL_CAFEINA_MG_DEFECTO,
} from './constantes';

/** Una dosis de cafeína y el instante en que fue ingerida, expresado en horas. */
export interface IngestaCafeina {
  dosisMg: number;
  hora: number;
}

/** Proyección mínima del usuario requerida por RN03 (campo ERD01). */
export interface UsuarioCafeina {
  semivida_h?: number | null;
}

type SemividaCafeina = number | UsuarioCafeina;

function resolverSemivida(valor: SemividaCafeina): number {
  const tMedia = typeof valor === 'number'
    ? valor
    : valor.semivida_h ?? SEMIVIDA_H_DEFECTO;
  validarSemivida(tMedia);
  return tMedia;
}

/**
 * Calcula la cafeína residual a una hora dada con un modelo de eliminación
 * de primer orden. Solo se consideran ingestas ya ocurridas (hora <= t).
 */
export function residual(
  ingestas: readonly IngestaCafeina[],
  t: number,
  tMedia: SemividaCafeina = SEMIVIDA_H_DEFECTO,
): number {
  validarHora(t, 't');
  const semivida = resolverSemivida(tMedia);

  return ingestas.reduce((total, ingesta) => {
    validarIngesta(ingesta);
    if (ingesta.hora > t) return total;
    return total + ingesta.dosisMg * 0.5 ** ((t - ingesta.hora) / semivida);
  }, 0);
}

/**
 * Calcula la hora de corte para una dosis potencial antes del sueño.
 * RN05 limita siempre el resultado a, como máximo, dormir menos seis horas.
 * Devuelve null cuando el residual previo ya consume o supera el umbral.
 */
export function calcularHoraCorte(
  dosisMg: number,
  dormir: number,
  previas: readonly IngestaCafeina[],
  tMedia: SemividaCafeina = SEMIVIDA_H_DEFECTO,
  umbral: number = UMBRAL_CAFEINA_MG_DEFECTO,
): number | null {
  validarDosis(dosisMg);
  validarHora(dormir, 'dormir');
  const semivida = resolverSemivida(tMedia);
  validarNoNegativo(umbral, 'umbral');

  const libre = umbral - residual(previas, dormir, semivida);
  if (libre <= 0) return null;

  const corteFarmacocinetico = dosisMg <= libre
    ? dormir
    : dormir - semivida * Math.log2(dosisMg / libre);
  return Math.min(
    corteFarmacocinetico,
    dormir - CORTE_CAFEINA_ANTES_DORMIR_H,
  );
}

function validarIngesta(ingesta: IngestaCafeina): void {
  validarDosis(ingesta.dosisMg);
  validarHora(ingesta.hora, 'hora de ingesta');
}

function validarDosis(dosisMg: number): void {
  validarNoNegativo(dosisMg, 'dosisMg');
}

function validarSemivida(tMedia: number): void {
  if (!Number.isFinite(tMedia) || tMedia <= 0) {
    throw new RangeError('tMedia debe ser un número finito mayor que cero');
  }
}

function validarHora(hora: number, nombre: string): void {
  if (!Number.isFinite(hora)) {
    throw new RangeError(`${nombre} debe ser un número finito`);
  }
}

function validarNoNegativo(valor: number, nombre: string): void {
  if (!Number.isFinite(valor) || valor < 0) {
    throw new RangeError(`${nombre} debe ser un número finito no negativo`);
  }
}
