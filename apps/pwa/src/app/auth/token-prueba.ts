/** Crea un JWT sin firma real, suficiente para probar la lectura del payload. */
export function crearJwtPrueba(
  payload: Record<string, unknown>,
  vigenteSegundos = 3600,
): string {
  const codificar = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  const exp = Math.floor(Date.now() / 1000) + vigenteSegundos;
  return `${codificar({ alg: 'HS256' })}.${codificar({ ...payload, exp })}.firma`;
}
