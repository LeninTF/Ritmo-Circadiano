import { Injectable, NotFoundException } from '@nestjs/common';
import type { CategoriaCronotipo, PerfilCronotipoDto, RespuestasRmeq } from '@circadiano/contracts';
import {
  CATEGORIA_RMEQ_SIN_RESPUESTA,
  clasificarCronotipo,
  sumarRespuestasRmeq,
} from '@circadiano/domain';
import { PrismaService } from '../../prisma/prisma.service';

/** RF03: cuestionario rMEQ y cronotipo del trabajador (RN07). */
@Injectable()
export class CronotipoService {
  constructor(private readonly prisma: PrismaService) {}

  async guardar(idUsuario: string, respuestas: RespuestasRmeq): Promise<PerfilCronotipoDto> {
    const puntaje = sumarRespuestasRmeq(respuestas);
    const datos = {
      respuestasRmeq: { ...respuestas },
      puntaje,
      categoria: clasificarCronotipo(puntaje),
    };
    const perfil = await this.prisma.perfilCronotipo.upsert({
      where: { idUsuario },
      create: { idUsuario, ...datos },
      update: datos,
    });
    return { puntaje: perfil.puntaje, categoria: perfil.categoria, actualizadoEn: perfil.actualizadoEn.toISOString() };
  }

  async obtener(idUsuario: string): Promise<PerfilCronotipoDto> {
    const perfil = await this.prisma.perfilCronotipo.findUnique({ where: { idUsuario } });
    if (!perfil) throw new NotFoundException('Aún no respondiste el cuestionario de cronotipo.');
    return { puntaje: perfil.puntaje, categoria: perfil.categoria, actualizadoEn: perfil.actualizadoEn.toISOString() };
  }

  /** Sin cuestionario respondido se usa "intermedio" (RN07). */
  async obtenerCategoria(idUsuario: string): Promise<CategoriaCronotipo> {
    const perfil = await this.prisma.perfilCronotipo.findUnique({
      where: { idUsuario },
      select: { categoria: true },
    });
    return perfil?.categoria ?? CATEGORIA_RMEQ_SIN_RESPUESTA;
  }
}
