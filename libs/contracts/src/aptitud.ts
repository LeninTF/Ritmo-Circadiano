import type { ColorSemaforo } from './semaforo';

export interface IAptitud {
  /** Horas acumuladas de sueño en las últimas 24 h. */
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

/** Motivo del color del semaforo (RN09). Rojo puede acumular los dos primeros. */
export type MotivoAptitud = 'sueno_insuficiente' | 'somnolencia_elevada' | 'sueno_intermedio' | 'sueno_suficiente';

export interface CrearAptitudResponse {
  color: ColorSemaforo;
  /** Sueno de las ultimas 24 h usado en el calculo, redondeado a 0,1 h. */
  horasSueno24h: number;
  motivos: MotivoAptitud[];
}

export interface EvaluacionDespacho {
  codigo: string;
  color: ColorSemaforo;
}

export interface ConsultarDespachoRequest {
  /** codigo_participante (P01). Sin el, la lista del dia de todos los que compartieron. */
  codigo?: string;
  fecha: string; // ISO date YYYY-MM-DD
}

export interface ConsultarDespachoResponse {
  evaluaciones: EvaluacionDespacho[];
}