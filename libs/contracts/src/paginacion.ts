/** Parametros estandar de paginacion en querystring. */
export interface PaginacionDto {
  pagina: number;
  tamano: number;
}

/** Respuesta estandar de listados paginados. */
export interface RespuestaPaginada<T> {
  items: T[];
  pagina: number;
  tamano: number;
  total: number;
}
