import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CrearTurnoDto {
  @ApiProperty({ description: 'UUID del trabajador asignado' })
  @IsUUID()
  idUsuario!: string;

  @ApiProperty({ description: 'UUID de la ruta del viaje' })
  @IsUUID()
  idRuta!: string;

  @ApiProperty({ description: 'Fecha del turno (YYYY-MM-DD)', example: '2026-10-16' })
  @IsDateString()
  fecha!: string;

  @ApiProperty({ description: 'Timestamp ISO de inicio programado' })
  @IsDateString()
  inicioProgramado!: string;

  @ApiProperty({ description: 'Timestamp ISO de fin programado' })
  @IsDateString()
  finProgramado!: string;

  @ApiProperty({ description: 'Horas continuas de conducción (RN01)', example: 4.5 })
  @IsNumber()
  horasConduccion!: number;

  @ApiProperty({ description: 'Indica si el turno intersecta la franja nocturna 22:00–05:59 (RN01)', example: false })
  @IsBoolean()
  esNocturno!: boolean;

  @ApiPropertyOptional({ enum: ['pendiente', 'confirmado', 'corregido'], default: 'pendiente' })
  @IsOptional()
  @IsEnum(['pendiente', 'confirmado', 'corregido'])
  estadoConfirmacion?: 'pendiente' | 'confirmado' | 'corregido';

  @ApiPropertyOptional({ description: 'Timestamp ISO de inicio real' })
  @IsOptional()
  @IsDateString()
  horaInicioReal?: string;

  @ApiPropertyOptional({ description: 'Timestamp ISO de fin real' })
  @IsOptional()
  @IsDateString()
  horaFinReal?: string;
}
