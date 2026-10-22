import type { Rol } from './rol';

/** Roles validos del sistema, en el mismo orden que el enum de Prisma. */
export const ROLES: readonly Rol[] = [
  'trabajador',
  'jefe_operaciones',
  'despachador',
  'administrador',
];

/** Usuario visible por el propio usuario o el administrador. Nunca incluye hash_clave. */
export interface UsuarioDto {
  id: string;
  codigoParticipante: string;
  rol: Rol;
  idArea: string;
  cargo?: string;
  rangoEdad?: string;
  sexo?: string;
  consentimiento: boolean;
  semividaH: number;
  fuma: boolean;
}

/** Cuerpo de POST /auth/registro (RF01). consentimiento debe ser true (RN11). */
export interface RegistroDto {
  correo: string;
  clave: string;
  idArea: string;
  cargo?: string;
  rangoEdad?: string;
  sexo?: string;
  consentimiento: boolean;
}

/** Cuerpo de POST /auth/login. */
export interface LoginDto {
  correo: string;
  clave: string;
}

/** Cuerpo de POST /auth/refresh. */
export interface RefrescarTokenDto {
  tokenRefresco: string;
}

/** Respuesta de login y refresh. El token de acceso dura 24 h como maximo. */
export interface AuthTokens {
  tokenAcceso: string;
  tokenRefresco: string;
  expiraEnSegundos: number;
}
