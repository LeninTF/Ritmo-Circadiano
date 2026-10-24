import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { ParametroSistemaDto } from '@circadiano/contracts';
import { PrismaService } from '../../../prisma/prisma.service';

interface ParametroEditable {
  descripcion: string;
  defecto: string;
  min: number;
  max: number;
}

/** Parametros que el administrador puede cambiar. Uno nuevo = una entrada aqui (OCP). */
export const PARAMETROS_EDITABLES: Record<string, ParametroEditable> = {
  umbral_cafeina_mg: {
    descripcion: 'Cafeina residual maxima al dormir, en mg (RN02, criterio de diseno)',
    defecto: '50',
    min: 0,
    max: 400,
  },
};

@Injectable()
export class ParametrosService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<ParametroSistemaDto[]> {
    const guardados = await this.prisma.parametroSistema.findMany();
    const valores = new Map(guardados.map((p) => [p.clave, p.valor]));
    return Object.entries(PARAMETROS_EDITABLES).map(([clave, p]) => ({
      clave,
      valor: valores.get(clave) ?? p.defecto,
      descripcion: p.descripcion,
    }));
  }

  async actualizar(clave: string, valor: string): Promise<ParametroSistemaDto> {
    const parametro = PARAMETROS_EDITABLES[clave];
    if (!parametro) throw new NotFoundException('Parametro no editable');
    const numero = Number(valor);
    if (valor.trim() === '' || !Number.isFinite(numero) || numero < parametro.min || numero > parametro.max) {
      throw new BadRequestException(`El valor debe ser un numero entre ${parametro.min} y ${parametro.max}`);
    }
    const guardado = String(numero);
    await this.prisma.parametroSistema.upsert({
      where: { clave },
      update: { valor: guardado },
      create: { clave, valor: guardado },
    });
    return { clave, valor: guardado, descripcion: parametro.descripcion };
  }
}
