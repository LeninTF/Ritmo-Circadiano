import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, validateSync } from 'class-validator';

export class Entorno {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsOptional()
  @IsString()
  PORT?: string;

  @IsOptional()
  @IsString()
  CORS_ORIGIN?: string;

  @IsOptional()
  @IsString()
  VAPID_PUBLIC_KEY?: string;

  @IsOptional()
  @IsString()
  VAPID_PRIVATE_KEY?: string;
}

/** Falla al arrancar si falta una variable obligatoria (p. ej. DATABASE_URL). */
export function validarEntorno(config: Record<string, unknown>): Entorno {
  const entorno = plainToInstance(Entorno, config);
  const errores = validateSync(entorno);
  if (errores.length > 0) {
    const detalle = errores
      .map(
        (e) => `${e.property}: ${Object.values(e.constraints ?? {}).join(', ')}`,
      )
      .join('; ');
    throw new Error(`Variables de entorno invalidas -> ${detalle}`);
  }
  return entorno;
}

