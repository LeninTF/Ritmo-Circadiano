import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Paginado, UsuarioAdminDto } from '@circadiano/contracts';
import { Auditable } from '../auditoria/auditable.decorator';
import { Roles } from '../auth/roles.decorator';
import { ActualizarUsuarioAdminDto } from './dto/actualizar-usuario-admin.dto';
import { UsuariosService } from './usuarios.service';

@ApiTags('Administracion (RF01)')
@ApiBearerAuth()
@Roles('administrador')
@Controller('admin/usuarios')
export class UsuariosAdminController {
  constructor(private readonly usuarios: UsuariosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar usuarios (sin correo)' })
  listar(
    @Query('pagina', new DefaultValuePipe(1), ParseIntPipe) pagina: number,
    @Query('tamanoPagina', new DefaultValuePipe(50), ParseIntPipe) tamanoPagina: number,
  ): Promise<Paginado<UsuarioAdminDto>> {
    return this.usuarios.listar(Math.max(1, pagina), Math.min(100, Math.max(1, tamanoPagina)));
  }

  @Patch(':id')
  @Auditable('usuario_actualizado')
  @ApiOperation({ summary: 'Cambiar rol, estado (retiro), area o cargo' })
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarUsuarioAdminDto,
  ): Promise<UsuarioAdminDto> {
    return this.usuarios.actualizar(id, dto);
  }
}
