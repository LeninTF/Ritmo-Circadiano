/**
 * Utility para calcular la duración total de sueño en un período concreto.
 *
 * La función es pura: no muta el array de parámetros ni ninguno de los objetos.
 *
 * @param sleepIntervals Array de intervalos de sueño. Cada objeto debe tener
 *        `{ inicio: string; fin: string }` con valores ISO8601.
 * @param windowStart Momento en que empieza la ventana de interés.
 * @param windowEnd Momento en que termina la ventana de interés.
 * @returns Duración en horas (double). Se devuelve 0 si no hay sueño.
 */
export function calcularHorasSueñoPoremana(
  sleepIntervals: Array<{ inicio: string; fin: string }>,
  windowStart: Date,
  windowEnd: Date,
): number {
  const ws = windowStart.getTime();
const we = windowEnd.getTime();

if (!Number.isFinite(ws) || !Number.isFinite(we)) {
  throw new Error('La ventana contiene fechas inválidas');
}

if (ws >= we) {
  throw new Error('windowStart debe ser anterior a windowEnd');
}

  // Filtramos y “clip” los intervalos
  const clipped = sleepIntervals
    .map(intervalo => {
      const desde = new Date(intervalo.inicio).getTime();
      const hasta = new Date(intervalo.fin).getTime();

      if (isNaN(desde) || isNaN(hasta)) {
        throw new Error('Fechas de sueño inválidas');
      }
      if (desde >= hasta) {
        throw new Error('Inicio debe ser estrictamente anterior a fin en el intervalo de sueño');
      }

      // Recorte al rango de la ventana
      const from = Math.max(desde, ws);
      const to = Math.min(hasta, we);

      if (from >= to) {
        // El intervalo no aporta sueño dentro de la ventana
        return null;
      }

      return { from, to };
    })
    .filter(Boolean) as Array<{ from: number; to: number }>;

  if (clipped.length === 0) return 0;

  // Ordenamos por inicio
  clipped.sort((a, b) => a.from - b.from);

  // Fusionamos intervalos superpuestos o contiguos
  const merged: Array<{ from: number; to: number }> = [];
  let curr = clipped[0];
  for (let i = 1; i < clipped.length; i++) {
    const next = clipped[i];
    if (next.from <= curr.to) {
      // Se solapan o se tocan
      curr = { from: curr.from, to: Math.max(curr.to, next.to) };
    } else {
      merged.push(curr);
      curr = next;
    }
  }
  merged.push(curr);

  // Sumamos duraciones
  const totalMs = merged.reduce((s, iv) => s + (iv.to - iv.from), 0);
  return totalMs / (1000 * 60 * 60); // horas
}
