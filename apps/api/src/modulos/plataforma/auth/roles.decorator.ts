import { SetMetadata } from '@nestjs/common';
import type { Rol } from '@circadiano/contracts';

export const ROLES_PERMITIDOS = 'rolesPermitidos';

/** Restringe la ruta a los roles indicados; otro rol recibe 403. */
export const Roles = (...roles: Rol[]) => SetMetadata(ROLES_PERMITIDOS, roles);
