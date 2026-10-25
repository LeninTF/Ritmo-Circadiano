import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import type { CrearUbicacionDto as CrearUbicacionContrato } from '@circadiano/contracts';

export class CrearUbicacionDto implements CrearUbicacionContrato {
  @ApiProperty({ example: -14.0689 })
  @IsLatitude()
  lat!: number;

  @ApiProperty({ example: -75.7222 })
  @IsLongitude()
  lng!: number;

  @ApiProperty({ example: 'Ica', description: 'Ciudad elegida o "Ubicación actual"' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  origen!: string;
}
