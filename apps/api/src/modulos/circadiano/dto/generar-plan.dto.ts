import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import type { GenerarPlanDto as GenerarPlanContrato } from '@circadiano/contracts';

export class GenerarPlanDto implements GenerarPlanContrato {
  @ApiProperty({ description: 'Turno propio para el que se genera el plan', format: 'uuid' })
  @IsUUID()
  idTurno!: string;
}
