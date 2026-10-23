import type { ColorSemaforo } from '@circadiano/contracts';

/**
 * Puerto de cálculo de aptitud.
 * La implementación real utilizará calcularAptitudPresalida()
 * cuando el PR 10 esté integrado.
 */
export interface AptitudCalculator {
  calcular(
    horasSueno24h: number,
    somnolencia: number,
  ): ColorSemaforo;
}