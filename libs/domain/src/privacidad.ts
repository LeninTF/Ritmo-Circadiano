/**
 * RN10 en microdatos: un valor de cuasi-identificador (area, cargo) que comparten
 * menos de k participantes se reemplaza para que la fila no identifique a nadie.
 */
export function generalizarCuasiIdentificador<T extends Record<string, unknown>>(
  filas: readonly T[],
  campo: keyof T,
  reemplazo: T[keyof T],
  k = 5,
): T[] {
  const conteo = new Map<unknown, number>();
  for (const fila of filas) conteo.set(fila[campo], (conteo.get(fila[campo]) ?? 0) + 1);
  return filas.map((fila) =>
    (conteo.get(fila[campo]) ?? 0) < k ? { ...fila, [campo]: reemplazo } : fila,
  );
}
