export interface ErrorApiDto {
  code: string;
  message: string;
  details?: unknown;
}

export const CODIGOS_ERROR = {
  NO_AUTENTICADO: 'no_autenticado',
  PROHIBIDO: 'prohibido',
  CREDENCIALES_INVALIDAS: 'credenciales_invalidas',
} as const;
