import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  validateSync,
} from 'class-validator';

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

  @IsString()
  @MinLength(32)
  JWT_SECRET!: string;

  /** Duracion del token de acceso: numero + s/m/h, maximo 24 h (RNF04). */
  @IsOptional()
  @Matches(/^\d+[smh]$/)
  JWT_EXPIRA?: string;
}

const MAX_EXPIRA_SEGUNDOS = 24 * 3600;
const SEGUNDOS_POR_UNIDAD = { s: 1, m: 60, h: 3600 } as const;

/** Convierte '8h' en segundos; por defecto 8 h. */
export function segundosDeExpira(valor = '8h'): number {
  const unidad = valor.slice(-1) as keyof typeof SEGUNDOS_POR_UNIDAD;
  return Number(valor.slice(0, -1)) * SEGUNDOS_POR_UNIDAD[unidad];
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
  if (segundosDeExpira(entorno.JWT_EXPIRA) > MAX_EXPIRA_SEGUNDOS) {
    throw new Error('Variables de entorno invalidas -> JWT_EXPIRA: maximo 24h');
  }
  return entorno;
}
