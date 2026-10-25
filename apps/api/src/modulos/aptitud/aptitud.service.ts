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
      registros.map((r) => ({ inicio: r.horaAcostarse.toISOString(), fin: r.horaDespertar.toISOString() })),
      inicio24h,
      ahora,
    );

    const { color } = calcularAptitudPresalida({ horasSueno24h, somnolencia: dto.somnolencia });
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
    return { color };
  }

  /**
   * Color de la ultima evaluacion de cada turno del participante en el dia (hora de Lima).
   * Solo el color y solo si esa ultima evaluacion se compartio (RN10).
   */
  async consultarDespacho(codigo: string, fecha: string): Promise<ConsultarDespachoResponse> {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha ?? '') || Number.isNaN(Date.parse(`${fecha}T00:00:00${ZONA_LIMA}`))) {
      throw new BadRequestException('fecha debe tener formato AAAA-MM-DD.');
    }
    if (!codigo?.trim()) {
      throw new BadRequestException('codigo es obligatorio.');
    }
    const desde = new Date(`${fecha}T00:00:00${ZONA_LIMA}`);
    const hasta = new Date(desde.getTime() + VENTANA_SUENO_MS);

    // Lectura minima de `usuario` (I1): solo traduce codigo_participante a id.
    const usuario = await this.prisma.usuario.findUnique({
      where: { codigoParticipante: codigo },
      select: { id: true },
    });
    if (!usuario) return { evaluaciones: [] };

    const ultimas = await this.prisma.aptitudPresalida.findMany({
      where: { idUsuario: usuario.id, fechaHora: { gte: desde, lt: hasta } },
      orderBy: { fechaHora: 'desc' },
      distinct: ['idTurno'],
      select: { color: true, compartido: true },
    });
    return {
      evaluaciones: ultimas.flatMap(({ color, compartido }) => {
        const visible = colorDivulgableAlDespachador(color, compartido);
        return visible ? [{ codigo, color: visible }] : [];
      }),
    };
  }
}
