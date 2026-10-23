import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Rol } from '@circadiano/contracts';
import { RolesGuard } from './roles.guard';

function contexto(
  usuario: { rol: Rol } | undefined,
  permitidos: Rol[] | undefined,
): { guard: RolesGuard; ctx: ExecutionContext } {
  const reflector = new Reflector();
  jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((clave) =>
    clave === 'rolesPermitidos' ? permitidos : undefined,
  );
  const ctx = {
    getHandler: () => undefined,
    getClass: () => undefined,
    switchToHttp: () => ({ getRequest: () => ({ usuario }) }),
  } as unknown as ExecutionContext;
  return { guard: new RolesGuard(reflector), ctx };
}

describe('RolesGuard', () => {
  it('deja pasar al rol correcto', () => {
    const { guard, ctx } = contexto({ rol: 'jefe_operaciones' }, [
      'jefe_operaciones',
    ]);
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('responde 403 al rol incorrecto', () => {
    const { guard, ctx } = contexto({ rol: 'trabajador' }, ['jefe_operaciones']);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('responde 403 si no hay usuario en la solicitud', () => {
    const { guard, ctx } = contexto(undefined, ['administrador']);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('sin @Roles basta con estar autenticado', () => {
    const { guard, ctx } = contexto({ rol: 'trabajador' }, undefined);
    expect(guard.canActivate(ctx)).toBe(true);
  });
});
