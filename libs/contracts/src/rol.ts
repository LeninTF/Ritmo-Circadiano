export const ROLES = [
  'trabajador',
  'jefe_operaciones',
  'despachador',
  'administrador',
] as const;

export type Rol = (typeof ROLES)[number];
