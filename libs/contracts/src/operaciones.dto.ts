export interface RutaDto {
  id: string;
  origen: string;
  destino: string;
  duracionEstimadaHoras: number;
  activa: boolean;
}

export interface TurnoDto {
  id: string;
  idUsuario: string;
  idRuta: string;
  fecha: string;
  inicioProgramado: string;
  finProgramado: string;
  horasConduccion: number;
  esNocturno: boolean;
  estadoConfirmacion: 'pendiente' | 'confirmado' | 'corregido';
  horaInicioReal?: string | null;
  horaFinReal?: string | null;
  confirmarExceso?: boolean;
  motivoExceso?: string | null;
  ruta?: RutaDto;
  usuario?: {
    id: string;
    nombre: string;
    correo: string;
    cargo?: string;
  };
}

export interface CrearTurnoDto {
  idUsuario: string;
  idRuta: string;
  fecha: string;
  inicioProgramado: string;
  finProgramado: string;
  horasConduccion: number;
  esNocturno: boolean;
  estadoConfirmacion?: 'pendiente' | 'confirmado' | 'corregido';
  horaInicioReal?: string;
  horaFinReal?: string;
  confirmarExceso?: boolean;
  motivoExceso?: string;
}

export interface ActualizarTurnoDto {
  idUsuario?: string;
  idRuta?: string;
  fecha?: string;
  inicioProgramado?: string;
  finProgramado?: string;
  horasConduccion?: number;
  esNocturno?: boolean;
  estadoConfirmacion?: 'pendiente' | 'confirmado' | 'corregido';
  horaInicioReal?: string;
  horaFinReal?: string;
  confirmarExceso?: boolean;
  motivoExceso?: string;
}

export interface EliminarTurnoRespuestaDto {
  mensaje: string;
}

export interface ImportarTurnosRespuestaDto {
  importados: number;
  errores: { linea: number; motivo: string }[];
}
