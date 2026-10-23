import { IsInt, Min, Max, IsBoolean, IsOptional } from 'class-validator';

/**
 * DTO para la autoevaluación de aptitud pre‑salida.
 *
 * `somnolencia` debe estar en la escala 1‑5.
 * `compartido` indica si el trabajador permite compartir la evaluación.
 */
export class CrearAptitudDto {
  /**
   * Escala de somnolencia.
   * 1 → muy vigilante
   * 5 → muy somnoliento
   */
  @IsInt()
  @Min(1)
  @Max(5)
  somnolencia!: number;

  /**
   * Consentimiento explícito para compartir la evaluación.
   * Cuando se omite se asume `false`.
   */
  @IsOptional()
  @IsBoolean()
  compartido?: boolean;
}
