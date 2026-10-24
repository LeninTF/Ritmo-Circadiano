import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';
import type { RespuestasRmeq } from '@circadiano/contracts';

/** Respuestas del rMEQ de 5 ítems (RF03, RN07). */
export class CrearPerfilCronotipoDto implements RespuestasRmeq {
  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt() @Min(1) @Max(5)
  p1!: number;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt() @Min(1) @Max(5)
  p2!: number;

  @ApiProperty({ minimum: 1, maximum: 4 })
  @IsInt() @Min(1) @Max(4)
  p3!: number;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt() @Min(1) @Max(5)
  p4!: number;

  @ApiProperty({ minimum: 0, maximum: 6 })
  @IsInt() @Min(0) @Max(6)
  p5!: number;
}
