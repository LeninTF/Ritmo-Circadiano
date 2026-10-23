import type { Rol } from './rol';

/** Nunca incluye correo ni hash_clave (CLAUDE.md §6). */
export interface UsuarioDto {
  id: string;
  codigoParticipante: string;
  rol: Rol;
  idArea: string;
  cargo: string | null;
  consentimiento: boolean;
  semividaH: number;
  fuma: boolean;
}

export interface RegistroDto {
  correo: string;
  clave: string;
  idArea: string;
  cargo?: string;
  rangoEdad?: string;
  sexo?: string;
  consentimiento: boolean;
}

export interface LoginDto {
  correo: string;
  clave: string;
}

export interface RefrescarTokenDto {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiraEnSegundos: number;
}

export interface UsuarioJwtPayload {
  sub: string;
  rol: Rol;
  codigoParticipante: string;
}

/** Area de la empresa para el formulario de registro (Tabla 5). */
export interface AreaDto {
  id: string;
  nombre: string;
}
