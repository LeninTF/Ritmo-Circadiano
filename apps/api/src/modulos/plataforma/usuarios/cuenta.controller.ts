import { Controller, Delete, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { UsuarioJwtPayload } from '@circadiano/contracts';
import { Auditable } from '../auditoria/auditable.decorator';
import { UsuarioActual } from '../auth/usuario-actual.decorator';
import { UsuariosService } from './usuarios.service';

@ApiTags('Identidad (RF01)')
@ApiBearerAuth()
@Controller('me')
export class CuentaController {
  constructor(private readonly usuarios: UsuariosService) {}

  /** Cualquier rol autenticado puede borrar su propia cuenta (RN11, Ley 29733). */
  @Delete()
  @HttpCode(204)
  @Auditable('borrado_cuenta')
  @ApiOperation({ summary: 'Eliminar mi cuenta y todos mis datos personales' })
  eliminar(@UsuarioActual() usuario: UsuarioJwtPayload): Promise<void> {
    return this.usuarios.eliminarCuenta(usuario.sub);
  }
}
