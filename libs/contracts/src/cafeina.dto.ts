export interface BebidaDto {
  id_bebida: number;
  nombre: string;
  cafeina_mg: number;
  volumen_ml: number;
}

export interface CrearIngestaCafeinaDto {
  id_usuario: string;
  id_bebida?: number | null;
  /** Solo para bebidas del catálogo (1 a 4); el servidor calcula los mg. */
  porciones?: number;
  /** Solo sin bebida del catálogo (1 a 1000 mg). */
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

/** Consumo de un día en hora de Lima (RF09). */
export interface ConsumoDiaDto {
  /** YYYY-MM-DD en America/Lima. */
  fecha: string;
  totalMg: number;
  conteo: number;
}

/** Cafeína activa ahora. Siempre es una estimación, nunca un dato médico. */
export interface CafeinaActivaDto {
  /** Redondeado a mg enteros. */
  mg: number;
  calculadoEn: string;
  /** Cuándo baja del umbral; null si ya está en nivel bajo. */
  horaNivelBajo: string | null;
  semividaH: number;
  umbralMg: number;
  esEstimacion: true;
}

/** Respuesta de GET /cafeina/resumen. La hora de corte sale del plan (PlanDiarioDto.horaCorteCafeina). */
export interface ResumenCafeinaDto {
  zonaHoraria: string;
  /** Exactamente `dias` elementos, del más antiguo a hoy. */
  dias: ConsumoDiaDto[];
  hoy: ConsumoDiaDto;
  cafeinaActiva: CafeinaActivaDto;
}
