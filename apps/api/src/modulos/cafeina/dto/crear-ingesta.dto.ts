import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsISO8601, IsOptional, IsUUID, Max, Min } from 'class-validator';
import type { CrearIngestaCafeinaDto } from '@circadiano/contracts';

/** Cuerpo de POST /cafeina y payload `ingesta` de /sync/lote. El dueño sale del token. */
export class CrearIngestaCafeinaBodyDto implements Omit<CrearIngestaCafeinaDto, 'id_usuario'> {
  @ApiPropertyOptional({ example: 1, description: 'Bebida del catálogo; el servidor calcula los mg.' })
  @IsOptional()
  @IsInt()
  @Min(1)
  id_bebida?: number | null;

  @ApiPropertyOptional({ minimum: 1, maximum: 4, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(4)
  porciones?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 1000, description: 'Solo sin bebida del catálogo.' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  cafeina_mg?: number;

  @ApiProperty({ example: '2026-10-24T13:30:00.000Z' })
  @IsISO8601({ strict: true })
  fecha_hora!: string;

  @ApiProperty({ description: 'UUID generado por el cliente; se reutiliza en los reintentos.' })
  @IsUUID()
  client_id!: string;
}
