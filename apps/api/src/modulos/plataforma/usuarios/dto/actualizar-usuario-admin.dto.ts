import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import {
  ESTADOS_USUARIO,
  ROLES,
  type ActualizarUsuarioAdminDto as ActualizarUsuarioAdminContrato,
  type EstadoUsuario,
  type Rol,
} from '@circadiano/contracts';

export class ActualizarUsuarioAdminDto implements ActualizarUsuarioAdminContrato {
  @ApiPropertyOptional({ enum: ROLES })
  @IsOptional()
  @IsIn(ROLES)
  rol?: Rol;

  @ApiPropertyOptional({ enum: ESTADOS_USUARIO, description: 'retirado = deja el estudio y no puede ingresar' })
  @IsOptional()
  @IsIn(ESTADOS_USUARIO)
  estado?: EstadoUsuario;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  idArea?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  cargo?: string;
}
