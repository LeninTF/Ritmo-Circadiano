import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CrearActualizarDiarioDto {
  @IsUUID()
  @IsNotEmpty()
  clientId!: string;

  @IsString()
  @IsNotEmpty()
  horaAcostarse!: string;

  @IsString()
  @IsNotEmpty()
  horaDespertar!: string;

  @IsInt()
  @Min(0)
  latenciaMin!: number;

  @IsInt()
  @Min(0)
  despertares!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  calidadPercibida!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  fatigaPercibida!: number;

  @IsBoolean()
  esDiaLaboral!: boolean;

  @IsInt()
  @Min(0)
  luzMatutinaMin!: number;
}

export class ConsultaDiarioFiltroDto {
  @IsString()
  @IsNotEmpty()
  desde!: string;

  @IsString()
  @IsNotEmpty()
  hasta!: string;
}

export interface DiarioRespuestaDto {
  id: string;
  idUsuario: string;
  fecha: string;
  horaAcostarse: string;
  horaDespertar: string;
  latenciaMin: number;
  despertares: number;
  calidadPercibida: number;
  fatigaPercibida: number;
  esDiaLaboral: boolean;
  luzMatutinaMin: number;
  clientId: string;
  updatedAt: string;
}
