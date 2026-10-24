import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ConfirmacionTurnoPayload, EstadoConfirmacionContrato } from '@circadiano/contracts';

export class ConfirmarTurnoDto implements ConfirmacionTurnoPayload {
  @ApiProperty({ description: 'Estado de confirmación del turno', enum: ['confirmado', 'corregido'], example: 'confirmado' })
  @IsEnum(['confirmado', 'corregido'])
  estadoConfirmacion!: EstadoConfirmacionContrato;

  @ApiPropertyOptional({ description: 'Timestamp ISO de inicio real del turno (requerido al corregir)', example: '2026-10-20T08:00:00Z' })
  @IsOptional()
  @IsDateString()
  horaInicioReal?: string | null;

  @ApiPropertyOptional({ description: 'Timestamp ISO de fin real del turno (requerido al corregir)', example: '2026-10-20T17:00:00Z' })
  @IsOptional()
  @IsDateString()
  horaFinReal?: string | null;
}
