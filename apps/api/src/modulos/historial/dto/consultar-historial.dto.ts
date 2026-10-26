import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn } from 'class-validator';

export class ConsultarHistorialDto {
  @ApiProperty({ enum: [7, 14, 30], example: 7 })
  @Type(() => Number)
  @IsIn([7, 14, 30])
  dias!: number;
}
