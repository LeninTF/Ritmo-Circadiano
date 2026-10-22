import { SetMetadata } from '@nestjs/common';

export const ES_PUBLICA = 'esPublica';

/** Excepcion explicita: la ruta no exige token (p. ej. /health, /auth/login). */
export const Publica = () => SetMetadata(ES_PUBLICA, true);
