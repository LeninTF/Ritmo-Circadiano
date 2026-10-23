import type { ColorSemaforo } from './semaforo';

export interface IAptitud {
  /**
   * Horas acumuladas de sueño en las últimas 24 h.
   */
  horasSueno24h: number;
  /**
   * Valor de la escala de somnolencia (1‑5).
   */
  somnolencia: number;
  /**
   * Resultado del semáforo (verde / ambar / rojo).
   */
  color: ColorSemaforo;
}
