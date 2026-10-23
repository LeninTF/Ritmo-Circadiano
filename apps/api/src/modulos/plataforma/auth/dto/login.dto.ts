import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import type { LoginDto as LoginContrato } from '@circadiano/contracts';

export class LoginDto implements LoginContrato {
  @ApiProperty({ example: 'conductor@ejemplo.pe' })
  @IsEmail()
  @MaxLength(255)
  correo!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  clave!: string;
}
