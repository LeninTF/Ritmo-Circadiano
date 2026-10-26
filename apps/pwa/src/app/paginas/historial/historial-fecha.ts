/** Fecha civil de Lima, sin convertirla en un instante UTC. */
export function fechaCivil(fecha: string): string {
  return fecha.split('-').reverse().join('/');
}
