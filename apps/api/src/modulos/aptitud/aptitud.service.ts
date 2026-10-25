import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import type { ConsultarDespachoResponse, CrearAptitudResponse } from '@circadiano/contracts';
import { calcularAptitudPresalida, colorDivulgableAlDespachador } from '@circadiano/domain';
import { PrismaService } from '../../prisma/prisma.service';
import { OperacionesService } from '../operaciones/operaciones.service';
import type { CrearAptitudDto } from './dto/crear-aptitud.dto';
import { calcularHorasSuenoEnVentana } from './utils/sleep-window';

const VENTANA_SUENO_MS = 24 * 60 * 60 * 1000;
// Peru no usa horario de verano: el dia de despacho es de 00:00 a 24:00 hora de Lima.
const ZONA_LIMA = '-05:00';

/** RF12: autoevaluacion pre-salida (RN09) y consulta del despachador (RN10). */
@Injectable()
export class AptitudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly operaciones: OperacionesService,
  ) {}

  /** Calcula el semaforo con el sueno registrado en las ultimas 24 h y lo guarda. */
  async crearAptitud(
    idUsuario: string,
    idTurno: string,
    dto: CrearAptitudDto,
    ahora = new Date(),
  ): Promise<CrearAptitudResponse> {
    // Servicio exportado de I2: 404 si el turno no existe.
    const turno = await this.operaciones.obtenerTurnoPorId(idTurno);
    if (turno.idUsuario !== idUsuario) {
      throw new ForbiddenException('El turno no pertenece al trabajador autenticado.');
    }

    const inicio24h = new Date(ahora.getTime() - VENTANA_SUENO_MS);
    const registros = await this.prisma.registroSueno.findMany({
      where: { idUsuario, horaDespertar: { gt: inicio24h }, horaAcostarse: { lt: ahora } },
      select: { horaAcostarse: true, horaDespertar: true },
    });
    const horasSueno24h = calcularHorasSuenoEnVentana(
      registros.map((r: { horaAcostarse: Date; horaDespertar: Date }) => ({ inicio: r.horaAcostarse.toISOString(), fin: r.horaDespertar.toISOString() })),
      inicio24h,
      ahora,
    );

    const { color, motivos } = calcularAptitudPresalida({ horasSueno24h, somnolencia: dto.somnolencia });
    await this.prisma.aptitudPresalida.create({
      data: {
        idUsuario,
        idTurno,
        fechaHora: ahora,
        horasSueno24h,
        somnolencia: dto.somnolencia,
        color,
        // RN10: sin consentimiento explicito no se comparte.
        compartido: dto.compartido === true,
      },
    });
    // Se persiste el valor exacto; solo la respuesta se redondea a 0,1 h.
    return { color, horasSueno24h: Math.round(horasSueno24h * 10) / 10, motivos: [...motivos] };
  }

  /**
   * Color de la ultima evaluacion de cada turno del dia (hora de Lima). Sin `codigo`, de todos
   * los participantes. Solo el color y solo si esa ultima evaluacion se compartio (RN10): quien
   * no evaluo o no compartio no aparece, para no revelar quien se nego (RN11).
   */
  async consultarDespacho(fecha: string, codigo?: string): Promise<ConsultarDespachoResponse> {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha ?? '') || Number.isNaN(Date.parse(`${fecha}T00:00:00${ZONA_LIMA}`))) {
      throw new BadRequestException('fecha debe tener formato AAAA-MM-DD.');
    }
    if (codigo !== undefined && (typeof codigo !== 'string' || !codigo.trim())) {
      throw new BadRequestException('codigo no puede estar vacio.');
    }
    const desde = new Date(`${fecha}T00:00:00${ZONA_LIMA}`);
    const hasta = new Date(desde.getTime() + VENTANA_SUENO_MS);

    const ultimas = await this.prisma.aptitudPresalida.findMany({
      where: {
        fechaHora: { gte: desde, lt: hasta },
        ...(codigo !== undefined && { usuario: { codigoParticipante: codigo } }),
      },
      orderBy: { fechaHora: 'desc' },
      distinct: ['idUsuario', 'idTurno'],
      // Lectura minima de `usuario` (I1): solo codigo_participante.
      select: { color: true, compartido: true, usuario: { select: { codigoParticipante: true } } },
    });
    return {
      evaluaciones: ultimas
        .flatMap(({ color, compartido, usuario }: { color: any; compartido: boolean; usuario: { codigoParticipante: string } }) => {
          const visible = colorDivulgableAlDespachador(color, compartido);
          return visible ? [{ codigo: usuario.codigoParticipante, color: visible }] : [];
        })
        .sort((a: { codigo: string; color: string }, b: { codigo: string; color: string }) => a.codigo.localeCompare(b.codigo)),
    };
  }
}

