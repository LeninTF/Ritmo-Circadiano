import { IsNotEmpty, IsOptional, IsString} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearSuscripcionPushDto {
  @ApiProperty({ description: 'ID del usuario propietario de la suscripción' })
  @IsString()
  @IsNotEmpty()
  id_usuario!: string;

  @ApiProperty({ description: 'Endpoint único de Web Push' })
  @IsString()
  @IsNotEmpty()
  endpoint!: string;

  @ApiProperty({ description: 'Clave pública P256DH' })
  @IsString()
  @IsNotEmpty()
  clave_p256dh!: string;

  @ApiProperty({ description: 'Clave de autenticación Auth' })
  @IsString()
  @IsNotEmpty()
  clave_auth!: string;
}

export class EncolarNotificacionDto {
  @ApiProperty({ description: 'ID del usuario destinatario' })
  @IsString()
  @IsNotEmpty()
  id_usuario!: string;

  @ApiPropertyOptional({ description: 'ID opcional del plan circadiano asociado' })
  @IsOptional()
  @IsString()
  id_plan?: string;

  @ApiProperty({ description: 'Tipo de notificación (luz, corte_cafeina, relajacion, dormir)' })
  @IsString()
  @IsNotEmpty()
  tipo!: string;

  @ApiProperty({ description: 'Fecha y hora programada en formato ISO string' })
  @IsString()
  @IsNotEmpty()
  programada_para!: string;
}

export class NotificacionRespuestaDto {
  @ApiProperty({ description: 'ID de la notificación' })
  id_notificacion!: number;

  @ApiProperty({ description: 'ID del usuario' })
  id_usuario!: string;

  @ApiPropertyOptional({ description: 'ID del plan' })
  id_plan?: string | null;

  @ApiProperty({ description: 'Tipo de notificación' })
  tipo!: string;

  @ApiProperty({ description: 'Fecha programada' })
  programada_para!: string;

  @ApiPropertyOptional({ description: 'Fecha de envío' })
  enviada_en?: string | null;

  @ApiProperty({ description: 'Estado actual (pendiente, enviada, fallida, cancelada)' })
  estado!: string;

  @ApiProperty({ description: 'Indicador de si fue abierta' })
  abierta!: boolean;
}
