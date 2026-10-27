export interface HistorialDiaDto {
  fecha: string;
  horasSueno: number | null;
  cafeinaResidual: number | null;
  diarioRegistrado: boolean;
  notificacionesAbiertas: number;
}

export interface HistorialRespuestaDto {
  dias: HistorialDiaDto[];
}