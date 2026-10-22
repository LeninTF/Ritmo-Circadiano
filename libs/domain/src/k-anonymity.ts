/**
 * Valida la regla de k-anonymity (RN10).
 * @param n Número de registros o participantes únicos evaluados.
 * @param k Umbral mínimo (por defecto 5).
 */
export function assertKAnonymity(n: number, k = 5): boolean {
  return n >= k;
}
