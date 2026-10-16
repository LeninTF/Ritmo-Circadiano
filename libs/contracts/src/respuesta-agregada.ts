/** Respuesta de todo agregado sujeto a k-anonymity (RN10). */
export type RespuestaAgregada<T> =
  | { suficiente: false }
  | { suficiente: true; datos: T };
