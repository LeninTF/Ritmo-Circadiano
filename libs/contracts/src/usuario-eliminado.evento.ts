export const USUARIO_ELIMINADO = 'UsuarioEliminado';

/**
 * I1 lo emite en DELETE /me antes de borrar al usuario (Ley 29733).
 * Cada slice borra sus filas del usuario; el listener debe ser idempotente
 * y usar `suppressErrors: false` para que un fallo detenga el borrado.
 */
export interface UsuarioEliminadoEvento {
  idUsuario: string;
}
