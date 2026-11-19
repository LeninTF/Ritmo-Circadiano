/**
 * Lee `clave` de localStorage; si no existe, mueve el valor de `claveAnterior`
 * (nombre previo a CircaRuta) para que nadie pierda sesion ni tema al actualizar.
 * shortcut: migracion temporal del cambio de nombre, borrar cuando ya no queden instalaciones previas.
 */
export function leerClaveMigrada(almacen: Storage, clave: string, claveAnterior: string): string | null {
  const actual = almacen.getItem(clave);
  if (actual !== null) return actual;
  const anterior = almacen.getItem(claveAnterior);
  if (anterior !== null) {
    almacen.setItem(clave, anterior);
    almacen.removeItem(claveAnterior);
  }
  return anterior;
}
