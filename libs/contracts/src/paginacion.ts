export interface Paginado<T> {
  datos: T[];
  total: number;
  pagina: number;
  tamanoPagina: number;
}
