import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import {
  CODIGOS_ERROR,
  type RegistroDto,
  type UsuarioDto,
} from '@circadiano/contracts';
import { PrismaService } from '../../../prisma/prisma.service';

const PREFIJO_PARTICIPANTE = 'P';
const DIGITOS_MINIMOS = 2;
const INTENTOS_CODIGO = 3;
const ERROR_UNICO_PRISMA = 'P2002';

@Injectable()
export class RegistroService {
  constructor(private readonly prisma: PrismaService) {}

  async registrar(dto: RegistroDto): Promise<UsuarioDto> {
    // RN11: sin consentimiento no se crea ningun registro.
    if (dto.consentimiento !== true) {
      throw new BadRequestException({
        code: CODIGOS_ERROR.CONSENTIMIENTO_REQUERIDO,
        message: 'Debes aceptar el consentimiento para participar',
      });
    }
    const area = await this.prisma.area.findUnique({
      where: { id: dto.idArea },
    });
    if (!area) {
      throw new BadRequestException({
        code: CODIGOS_ERROR.AREA_INVALIDA,
        message: 'El area indicada no existe',
      });
    }

    const correo = dto.correo.trim().toLowerCase();
    const hashClave = await argon2.hash(dto.clave);

    for (let intento = 1; ; intento++) {
      try {
        const usuario = await this.prisma.usuario.create({
          data: {
            idArea: dto.idArea,
            codigoParticipante: await this.siguienteCodigo(),
            rol: 'trabajador',
            cargo: dto.cargo,
            correo,
            hashClave,
            rangoEdad: dto.rangoEdad,
            sexo: dto.sexo,
            consentimiento: true,
            fechaConsentimiento: new Date(),
          },
        });
        return {
          id: usuario.id,
          codigoParticipante: usuario.codigoParticipante,
          rol: usuario.rol,
          idArea: usuario.idArea,
          cargo: usuario.cargo,
          consentimiento: usuario.consentimiento,
          semividaH: Number(usuario.semividaH),
          fuma: usuario.fuma,
        };
      } catch (error) {
        const objetivo = this.objetivoDuplicado(error);
        if (objetivo === null) throw error;
        if (objetivo.includes('correo')) {
          throw new ConflictException({
            code: CODIGOS_ERROR.CORREO_DUPLICADO,
            message: 'Ya existe una cuenta con ese correo',
          });
        }
        // Dos registros simultaneos tomaron el mismo codigo: se recalcula.
        if (intento >= INTENTOS_CODIGO) throw error;
      }
    }
  }

  /** P01, P02... (correlativo en servidor). El administrador A01 no cuenta. */
  private async siguienteCodigo(): Promise<string> {
    const existentes = await this.prisma.usuario.findMany({
      where: { codigoParticipante: { startsWith: PREFIJO_PARTICIPANTE } },
      select: { codigoParticipante: true },
    });
    const mayor = existentes
      .map((u) => Number(u.codigoParticipante.slice(PREFIJO_PARTICIPANTE.length)))
      .filter(Number.isInteger)
      .reduce((max, n) => Math.max(max, n), 0);
    return `${PREFIJO_PARTICIPANTE}${String(mayor + 1).padStart(DIGITOS_MINIMOS, '0')}`;
  }

  private objetivoDuplicado(error: unknown): string | null {
    const e = error as { code?: string; meta?: { target?: unknown } };
    if (e?.code !== ERROR_UNICO_PRISMA) return null;
    const objetivo = e.meta?.target;
    return Array.isArray(objetivo) ? objetivo.join(',') : String(objetivo ?? '');
  }
}
