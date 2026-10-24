import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsISO8601, IsOptional, Max, Min } from 'class-validator';

/** Query `?fecha=AAAA-MM-DD` (día en hora de Lima). */
export class ConsultarFechaDto {
  @ApiProperty({ example: '2026-10-24' })
  @IsISO8601({ strict: true })
  fecha!: string;
}

/** Query de GET /eventos-solares: hasta 7 días desde `desde` (RF06). */
export class ConsultarEventosSolaresDto {
  @ApiProperty({ example: '2026-10-24' })
  @IsISO8601({ strict: true })
  desde!: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 7, default: 7 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(7)
  dias = 7;
}
