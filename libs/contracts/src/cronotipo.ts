/** Categorias del rMEQ de 5 items (RN07). */
export type CategoriaCronotipo =
  | 'vespertino_definido'
  | 'vespertino_moderado'
  | 'intermedio'
  | 'matutino_moderado'
  | 'matutino_definido';

/**
 * Respuestas al rMEQ de 5 items (Adan y Almirall, 1991). Rangos por item:
 * p1 1-5, p2 1-5, p3 1-4, p4 1-5, p5 0-6. La suma queda en 4-25.
 */
export interface RespuestasRmeq {
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  p5: number;
}

/** Respuesta de POST /cronotipo y GET /cronotipo/me. */
export interface PerfilCronotipoDto {
  puntaje: number;
  categoria: CategoriaCronotipo;
  actualizadoEn: string;
}
