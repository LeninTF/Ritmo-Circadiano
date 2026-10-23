import type { AptitudCalculator } from './aptitud.calculator';
import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

import type {
  UsuarioJwtPayload,
  ColorSemaforo,
} from '@circadiano/contracts';

import type { CrearAptitudDto } from './dto/crear-aptitud.dto';

import { calcularHorasSueñoPoremana } from './utils/sleep-window';

/**
 * Interfaces de repositorios. Se usan en los tests como mocks.
 */
export interface RegistroSueno {
  inicio: string; // ISO string
  fin: string;
}
export interface TurnoLaboral {
  id: string;
  idUsuario: string;
}
export interface RegistroAptitud {
  idUsuario: string;
  idTurno: string;
  fechaHora: Date;
  horasSueno24h: number;
  somnolencia: number;
  color: ColorSemaforo;
  compartido: boolean;
}

export interface RegistroSuenoRepository {
  /**
   * Devuelve los registros de sueño del usuario dentro del rango.
   */
  findByUserAndRange(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<RegistroSueno[]>;
}
export interface TurnoRepository {
  findById(id: string): Promise<TurnoLaboral | null>;
}
export interface AptitudRepository {
  save(aptitud: RegistroAptitud): Promise<void>;

  findCompartidos(
    codigo: string,
    fecha: Date,
  ): Promise<
    Array<{
      codigo: string;
      color: ColorSemaforo;
      compartido: boolean;
    }>
  >;
}

@Injectable()
export class AptitudService {
  constructor(
  private readonly registroSuenoRepo: RegistroSuenoRepository,
  private readonly turnoRepo: TurnoRepository,
  private readonly aptitudRepo: AptitudRepository,
  private readonly aptitudCalculator: AptitudCalculator,
) {}

  /**
   * Registra una autoevaluación.
   * @param dto DTO con somnolencia y consentimiento opcional
   * @param turnoId Identificador del turno a evaluar
   * @param user Data extraído de JwtAuthGuard via UsuarioActual
   */
  async crearAptitud(
  dto: CrearAptitudDto,
  turnoId: string,
  user: UsuarioJwtPayload,
): Promise<{ color: ColorSemaforo }> {

  // 1. Validar identidad
  if (!user || !user.sub) {
    throw new ForbiddenException('Usuario no autenticado');
  }

  // 2. Validar somnolencia
  if (
    !Number.isInteger(dto.somnolencia) ||
    dto.somnolencia < 1 ||
    dto.somnolencia > 5
  ) {
    throw new BadRequestException('Somnolencia inválida');
  }

  // 3. Consultar y verificar el turno
  const turno = await this.turnoRepo.findById(turnoId);

  if (!turno) {
    throw new ForbiddenException('Turno no encontrado');
  }

  if (turno.idUsuario !== user.sub) {
    throw new ForbiddenException(
      'El turno no pertenece al trabajador autenticado',
    );
  }

    const ahora = new Date();
    const inicio24h = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);
    const periodos = await this.registroSuenoRepo.findByUserAndRange(user.sub, inicio24h, ahora);

    const horasSueno24h = calcularHorasSueñoPoremana(
      periodos.map((p) => ({ inicio: p.inicio, fin: p.fin })),
      inicio24h,
      ahora,
    );

    // Validación somnolencia
    if (
  !Number.isInteger(dto.somnolencia) ||
  dto.somnolencia < 1 ||
  dto.somnolencia > 5
) {
  throw new BadRequestException('Somnolencia inválida');
}

    const compartido = dto.compartido ?? false;

    const color = this.aptitudCalculator.calcular(
  horasSueno24h,
  dto.somnolencia,
);

    const registro: RegistroAptitud = {
      idUsuario: user.sub,
      idTurno: turnoId,
      fechaHora: ahora,
      horasSueno24h,
      somnolencia: dto.somnolencia,
      color,
      compartido,
    };

    try {
      await this.aptitudRepo.save(registro);
    } catch {
      throw new InternalServerErrorException('Error al persistir la evaluación');
    }

    return { color };
  }

  /**
   * Consulta las evaluaciones compartidas para el despachador.
   */
  async consultarDespacho(
  codigo: string,
  fechaBuscar: Date,
): Promise<Array<{ codigo: string; color: ColorSemaforo }>> {
  if (
    !(fechaBuscar instanceof Date) ||
    !Number.isFinite(fechaBuscar.getTime())
  ) {
    throw new BadRequestException('Fecha inválida');
  }

  const evaluaciones = await this.aptitudRepo.findCompartidos(
    codigo,
    fechaBuscar,
  );

  return evaluaciones
    .filter((evaluacion) => evaluacion.compartido === true)
    .map((evaluacion) => ({
      codigo: evaluacion.codigo,
      color: evaluacion.color,
    }));
}
}
