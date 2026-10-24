import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, Max, Min } from 'class-validator';
import type { RespuestasRmeq } from '@circadiano/contracts';

/** Respuestas del rMEQ de 5 ítems (RF03, RN07); rangos de cada ítem en RespuestasRmeq. */
export class CrearPerfilCronotipoDto implements RespuestasRmeq {
  @ApiProperty({ minimum: 1, maximum: 5, description: 'Hora a la que se levantaría' })
  @IsInt() @Min(1) @Max(5)
  p1!: number;

  @ApiProperty({ minimum: 1, maximum: 4, description: 'Cómo se siente la primera media hora' })
  @IsInt() @Min(1) @Max(4)
  p2!: number;

  @ApiProperty({ minimum: 1, maximum: 5, description: 'Hora en que siente sueño' })
  @IsInt() @Min(1) @Max(5)
  p3!: number;

  @ApiProperty({ minimum: 1, maximum: 5, description: 'Hora de su mejor momento' })
  @IsInt() @Min(1) @Max(5)
  p4!: number;

  @ApiProperty({ enum: [0, 2, 4, 6], description: 'Se considera matutino o vespertino' })
  @IsIn([0, 2, 4, 6])
  p5!: number;
}
