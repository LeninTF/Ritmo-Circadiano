import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { RegistroDto as RegistroContrato } from '@circadiano/contracts';

export class RegistroDto implements RegistroContrato {
  @ApiProperty({ example: 'conductor@ejemplo.pe' })
  @IsEmail()
  @MaxLength(255)
  correo!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  clave!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  idArea!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  cargo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  rangoEdad?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  sexo?: string;

  @ApiProperty({ description: 'Debe ser true; sin consentimiento no hay registro (RN11)' })
  @IsBoolean()
  consentimiento!: boolean;
}
