import {
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { CrearActualizarDiarioDto, DiarioRespuestaDto } from '@circadiano/contracts';

/**
 * Interfaz de Repositorio para el Diario de Sueño.
 * Define el contrato de persistencia para desacoplar la lógica de aplicación de Prisma.
 */
export interface IDiarioRepository {
  upsert(idUsuario: string, fecha: string, datos: Partial<DiarioRespuestaDto>): Promise<DiarioRespuestaDto>;
  consultar(idUsuario: string, desde: Date, hasta: Date): Promise<DiarioRespuestaDto[]>;
}
export const DIARIO_REPOSITORY = Symbol('DIARIO_REPOSITORY');
@Injectable()
export class DiarioService {
  // El repositorio será inyectado mediante un token cuando la implementación de Prisma esté disponible.
 constructor(
  @Inject(DIARIO_REPOSITORY)
  private readonly repository: IDiarioRepository,
) {}

  private validarFechaIso(fechaStr: string): Date {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(fechaStr)) {
      throw new BadRequestException('Formato de fecha inválido. Use YYYY-MM-DD.');
    }
    const [anio, mes, dia] = fechaStr.split('-').map(Number);
    const fechaObj = new Date(Date.UTC(anio, mes - 1, dia));
    if (
      fechaObj.getUTCFullYear() !== anio ||
      fechaObj.getUTCMonth() !== mes - 1 ||
      fechaObj.getUTCDate() !== dia
    ) {
      throw new BadRequestException('Fecha inexistente o inválida.');
    }
    return fechaObj;
  }

  async upsertDiario(
    idUsuario: string,
    fechaStr: string,
    dto: CrearActualizarDiarioDto,
  ): Promise<DiarioRespuestaDto> {
    if (!idUsuario || !idUsuario.trim()) {
      throw new BadRequestException('Usuario no autenticado o ID inválido.');
    }
    this.validarFechaIso(fechaStr);

    if (dto.calidadPercibida < 1 || dto.calidadPercibida > 5) {
      throw new BadRequestException('Calidad percibida debe estar entre 1 y 5.');
    }
    if (dto.fatigaPercibida < 1 || dto.fatigaPercibida > 5) {
      throw new BadRequestException('Fatiga percibida debe estar entre 1 y 5.');
    }

    return this.repository.upsert(idUsuario, fechaStr, dto);
  }

  async consultarDiarios(
    idUsuario: string,
    desde: string,
    hasta: string,
  ): Promise<DiarioRespuestaDto[]> {
    if (!idUsuario || !idUsuario.trim()) {
      throw new BadRequestException('Usuario no autenticado o ID inválido.');
    }
    const desdeDate = this.validarFechaIso(desde);
    const hastaDate = this.validarFechaIso(hasta);

    if (desdeDate > hastaDate) {
      throw new BadRequestException('La fecha "desde" no puede ser posterior a "hasta".');
    }

    return this.repository.consultar(idUsuario, desdeDate, hastaDate);
  }
}

