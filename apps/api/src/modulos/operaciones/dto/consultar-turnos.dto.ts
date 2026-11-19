import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

/** Query de GET /operaciones/turnos (RF04). */
export class ConsultarTurnosDto {
  @ApiPropertyOptional({ description: 'UUID del trabajador' })
  @IsOptional()
  @IsUUID()
  idUsuario?: string;

  @ApiPropertyOptional({ description: 'Fecha exacta (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @ApiPropertyOptional({ description: 'Desde esta fecha, inclusive (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  desde?: string;

  @ApiPropertyOptional({ description: 'Hasta esta fecha, inclusive (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  hasta?: string;
}
