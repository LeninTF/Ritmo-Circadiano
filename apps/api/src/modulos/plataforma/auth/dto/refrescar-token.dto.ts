import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import type { RefrescarTokenDto as RefrescarContrato } from '@circadiano/contracts';

export class RefrescarTokenDto implements RefrescarContrato {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(2048)
  refreshToken!: string;
}
