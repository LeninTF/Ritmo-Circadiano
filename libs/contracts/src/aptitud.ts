import type { ColorSemaforo } from './semaforo';

export interface IAptitud {
  /** Horas acumuladas de sueño en las últimas 24 h. */
  horasSueno24h: number;
  /** Valor de la escala de somnolencia (1‑5). */
  somnolencia: number;
  /** Resultado del semáforo (verde / ambar / rojo). */
  color: ColorSemaforo;
}

export interface CrearAptitudRequest {
  somnolencia: number;
  compartido?: boolean;
}

export interface CrearAptitudResponse {
  color: ColorSemaforo;
}

export interface EvaluacionDespacho {
  codigo: string;
  color: ColorSemaforo;
}

export interface ConsultarDespachoRequest {
  codigo: string;
  fecha: string; // ISO date YYYY-MM-DD
}

export interface ConsultarDespachoResponse {
  evaluaciones: EvaluacionDespacho[];
}