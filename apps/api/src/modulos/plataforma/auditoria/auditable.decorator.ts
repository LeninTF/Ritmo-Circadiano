import { SetMetadata } from '@nestjs/common';
import type { Request } from 'express';

export const AUDITABLE = 'auditable';

export interface OpcionesAuditoria {
  accion: string;
  /** Si se define, solo se audita cuando devuelve true (p. ej. turno con exceso confirmado). */
  aplica?: (solicitud: Request) => boolean;
}

/** Registra una fila en audit_log cuando la ruta responde con exito. */
export const Auditable = (accion: string, aplica?: OpcionesAuditoria['aplica']) =>
  SetMetadata(AUDITABLE, { accion, aplica } satisfies OpcionesAuditoria);
