import { ConflictException, Injectable } from '@nestjs/common';
import type { CrearActualizarDiarioDto, DiarioRespuestaDto } from '@circadiano/contracts';
import type { RegistroSueno } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { IDiarioRepository } from './diario.service';

const ERROR_UNICO_PRISMA = 'P2002';

/** Persistencia de registro_sueno: un registro por (usuario, fecha), upsert (RF11). */
@Injectable()
export class PrismaDiarioRepository implements IDiarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(
    idUsuario: string,
    fecha: string,
    datos: CrearActualizarDiarioDto,
  ): Promise<DiarioRespuestaDto> {
    const dia = new Date(`${fecha}T00:00:00.000Z`);
    const { clientId, horaAcostarse, horaDespertar, ...resto } = datos;
    const campos = {
      ...resto,
      horaAcostarse: new Date(horaAcostarse),
      horaDespertar: new Date(horaDespertar),
    };
    try {
      const fila = await this.prisma.registroSueno.upsert({
        where: { idUsuario_fecha: { idUsuario, fecha: dia } },
        // El client_id original se conserva al actualizar: identifica la creacion offline.
        create: { idUsuario, fecha: dia, clientId, ...campos },
        update: campos,
      });
      return aRespuesta(fila);
    } catch (error) {
      // client_id ya usado en otro dia u otro usuario: no se devuelve la fila ajena.
      if ((error as { code?: string }).code === ERROR_UNICO_PRISMA) {
        throw new ConflictException('client_id ya usado');
      }
      throw error;
    }
  }

  async consultar(idUsuario: string, desde: Date, hasta: Date): Promise<DiarioRespuestaDto[]> {
    const filas = await this.prisma.registroSueno.findMany({
      where: { idUsuario, fecha: { gte: desde, lte: hasta } },
      orderBy: { fecha: 'asc' },
    });
    return filas.map(aRespuesta);
  }
}

function aRespuesta(fila: RegistroSueno): DiarioRespuestaDto {
  return {
    id: fila.id,
    idUsuario: fila.idUsuario,
    fecha: fila.fecha.toISOString().slice(0, 10),
    horaAcostarse: fila.horaAcostarse.toISOString(),
    horaDespertar: fila.horaDespertar.toISOString(),
    latenciaMin: fila.latenciaMin,
    despertares: fila.despertares,
    calidadPercibida: fila.calidadPercibida,
    fatigaPercibida: fila.fatigaPercibida,
    esDiaLaboral: fila.esDiaLaboral,
    luzMatutinaMin: fila.luzMatutinaMin,
    clientId: fila.clientId,
    updatedAt: fila.updatedAt.toISOString(),
  };
}
