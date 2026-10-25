/** ERD02: parametro editable por el administrador (p. ej. umbral_cafeina_mg, RN02). */
export interface ParametroSistemaDto {
  clave: string;
  valor: string;
  descripcion: string;
}

export interface ActualizarParametroDto {
  valor: string;
}
