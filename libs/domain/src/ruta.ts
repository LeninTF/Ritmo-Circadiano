/** Entidad de dominio: ruta de viaje interprovincial. */
export interface Ruta {
  id: string;
  origen: string;
  destino: string;
  /** Distancia en kilómetros. */
  distanciaKm: number;
  /** Duración estimada en horas. */
  duracionEstimadaH: number;
  activa: boolean;
}
