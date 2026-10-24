import {
  CORTE_CAFEINA_ANTES_DORMIR_H,
  DESFASE_LIMA_H,
  SEMIVIDA_H_DEFECTO,
  UMBRAL_CAFEINA_MG_DEFECTO,
  VENTANA_CAFEINA_ACTIVA_H,
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

export interface CafeinaActiva {
  /** Sin redondear: se redondea solo al responder. */
  mg: number;
  /** Hora (en horas) en que baja del umbral; null si ya está en nivel bajo. */
  horaNivelBajo: number | null;
}

/**
 * Estima la cafeína activa en `ahora` con las ingestas de las últimas 24 h y cuándo
 * bajará del umbral. Todas decaen al mismo ritmo, así que la hora es exacta:
 * ahora + t½ · log2(mg / umbral).
 */
export function calcularCafeinaActiva(
  ingestas: readonly IngestaCafeina[],
  ahora: number,
  tMedia: SemividaCafeina = SEMIVIDA_H_DEFECTO,
  umbral: number = UMBRAL_CAFEINA_MG_DEFECTO,
): CafeinaActiva {
  validarHora(ahora, 'ahora');
  const semivida = resolverSemivida(tMedia);
  if (!Number.isFinite(umbral) || umbral <= 0) {
    throw new RangeError('umbral debe ser un número finito mayor que cero');
  }

  const recientes = ingestas.filter((i) => i.hora >= ahora - VENTANA_CAFEINA_ACTIVA_H);
  const mg = residual(recientes, ahora, semivida);
  return {
    mg,
    horaNivelBajo: mg <= umbral ? null : ahora + semivida * Math.log2(mg / umbral),
  };
}

export interface ConsumoDia {
  /** Fecha local en America/Lima, YYYY-MM-DD. */
  fecha: string;
  totalMg: number;
  conteo: number;
}

/**
 * Agrupa las ingestas por día de Lima. Devuelve exactamente `dias` elementos,
 * del más antiguo al más reciente; el último es el día de `ahora`. Días sin consumo van en 0.
 */
export function resumirConsumoPorDia(
  ingestas: readonly IngestaCafeina[],
  ahora: number,
  dias: number,
): ConsumoDia[] {
  validarHora(ahora, 'ahora');
  if (!Number.isInteger(dias) || dias < 1) {
    throw new RangeError('dias debe ser un entero mayor o igual a 1');
  }

  const diaLima = (hora: number) => Math.floor((hora + DESFASE_LIMA_H) / 24);
  const hoy = diaLima(ahora);
  const resumen: ConsumoDia[] = Array.from({ length: dias }, (_, i) => ({
    fecha: new Date((hoy - dias + 1 + i) * 86_400_000).toISOString().slice(0, 10),
    totalMg: 0,
    conteo: 0,
  }));

  for (const ingesta of ingestas) {
    validarIngesta(ingesta);
    const indice = diaLima(ingesta.hora) - (hoy - dias + 1);
    if (indice < 0 || indice >= dias) continue;
    resumen[indice].totalMg += ingesta.dosisMg;
    resumen[indice].conteo += 1;
  }
  return resumen;
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
