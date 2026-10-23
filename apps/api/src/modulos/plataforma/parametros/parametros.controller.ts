import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import type {
  ActualizarParametroDto as ActualizarParametroContrato,
  ParametroSistemaDto,
} from '@circadiano/contracts';
import { Auditable } from '../auditoria/auditable.decorator';
import { Roles } from '../auth/roles.decorator';
import { ParametrosService } from './parametros.service';

export class ActualizarParametroDto implements ActualizarParametroContrato {
  @ApiProperty({ example: '50' })
  @IsString()
  @MaxLength(50)
  valor!: string;
}

@ApiTags('Administracion (RN02)')
@ApiBearerAuth()
@Roles('administrador')
@Controller('admin/parametros')
export class ParametrosController {
  constructor(private readonly parametros: ParametrosService) {}

  @Get()
  @ApiOperation({ summary: 'Parametros del sistema editables' })
  listar(): Promise<ParametroSistemaDto[]> {
    return this.parametros.listar();
  }

  @Put(':clave')
  @Auditable('parametro_actualizado')
  @ApiOperation({ summary: 'Cambiar el valor de un parametro (validado por rango)' })
  actualizar(
    @Param('clave') clave: string,
    @Body() dto: ActualizarParametroDto,
  ): Promise<ParametroSistemaDto> {
    return this.parametros.actualizar(clave, dto.valor);
  }
}
