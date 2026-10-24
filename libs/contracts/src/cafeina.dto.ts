export interface BebidaDto {
  id_bebida: number;
  nombre: string;
  cafeina_mg: number;
  volumen_ml: number;
}

export interface CrearIngestaCafeinaDto {
  id_usuario: string;
  id_bebida?: number | null;
  cafeina_mg?: number;
  fecha_hora: string;
  client_id: string;
}

export interface IngestaCafeinaRespuestaDto {
  id_ingesta: number;
  id_usuario: string;
  id_bebida: number | null;
  cafeina_mg: number;
  fecha_hora: string;
  residual_estimado_mg: number;
  client_id: string;
}

export interface ResidualCafeinaRespuestaDto {
  residual_mg: number;
  umbral_mg: number;
  supera_umbral: boolean;
  hora_corte: number | null;
  sugerencia: string;
}
