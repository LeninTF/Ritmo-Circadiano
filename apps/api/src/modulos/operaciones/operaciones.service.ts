import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearTurnoDto } from './dto/crear-turno.dto';
import { ActualizarTurnoDto } from './dto/actualizar-turno.dto';

@Injectable()
export class OperacionesService {
  constructor(private readonly prisma: PrismaService) {}

  async listarRutas() {
    return this.prisma.ruta.findMany({
      where: { activa: true },
    });
  }

  async listarTurnos(filtros?: { idUsuario?: string; fecha?: string }) {
    return this.prisma.turnoLaboral.findMany({
      where: {
        ...(filtros?.idUsuario ? { idUsuario: filtros.idUsuario } : {}),
        ...(filtros?.fecha ? { fecha: new Date(filtros.fecha) } : {}),
      },
      include: { ruta: true },
      orderBy: { inicioProgramado: 'asc' },
    });
  }

  async obtenerTurnoPorId(id: string) {
    const turno = await this.prisma.turnoLaboral.findUnique({
      where: { id },
      include: { ruta: true },
    });
    if (!turno) {
      throw new NotFoundException(`Turno con ID ${id} no encontrado`);
    }
    return turno;
  }

  async crearTurno(dto: CrearTurnoDto) {
    const ruta = await this.prisma.ruta.findUnique({ where: { id: dto.idRuta } });
    if (!ruta) {
      throw new BadRequestException(`Ruta con ID ${dto.idRuta} no existe`);
    }

    return this.prisma.turnoLaboral.create({
      data: {
        idUsuario: dto.idUsuario,
        idRuta: dto.idRuta,
        fecha: new Date(dto.fecha),
        inicioProgramado: new Date(dto.inicioProgramado),
        finProgramado: new Date(dto.finProgramado),
        horasConduccion: dto.horasConduccion,
        esNocturno: dto.esNocturno,
        estadoConfirmacion: dto.estadoConfirmacion ?? 'pendiente',
        horaInicioReal: dto.horaInicioReal ? new Date(dto.horaInicioReal) : null,
        horaFinReal: dto.horaFinReal ? new Date(dto.horaFinReal) : null,
      },
      include: { ruta: true },
    });
  }

  async actualizarTurno(id: string, dto: ActualizarTurnoDto) {
    await this.obtenerTurnoPorId(id);

    if (dto.idRuta) {
      const ruta = await this.prisma.ruta.findUnique({ where: { id: dto.idRuta } });
      if (!ruta) {
        throw new BadRequestException(`Ruta con ID ${dto.idRuta} no existe`);
      }
    }

    return this.prisma.turnoLaboral.update({
      where: { id },
      data: {
        ...(dto.idUsuario ? { idUsuario: dto.idUsuario } : {}),
        ...(dto.idRuta ? { idRuta: dto.idRuta } : {}),
        ...(dto.fecha ? { fecha: new Date(dto.fecha) } : {}),
        ...(dto.inicioProgramado ? { inicioProgramado: new Date(dto.inicioProgramado) } : {}),
        ...(dto.finProgramado ? { finProgramado: new Date(dto.finProgramado) } : {}),
        ...(dto.horasConduccion !== undefined ? { horasConduccion: dto.horasConduccion } : {}),
        ...(dto.esNocturno !== undefined ? { esNocturno: dto.esNocturno } : {}),
        ...(dto.estadoConfirmacion ? { estadoConfirmacion: dto.estadoConfirmacion } : {}),
        ...(dto.horaInicioReal !== undefined ? { horaInicioReal: dto.horaInicioReal ? new Date(dto.horaInicioReal) : null } : {}),
        ...(dto.horaFinReal !== undefined ? { horaFinReal: dto.horaFinReal ? new Date(dto.horaFinReal) : null } : {}),
      },
      include: { ruta: true },
    });
  }

  async eliminarTurno(id: string) {
    await this.obtenerTurnoPorId(id);
    await this.prisma.turnoLaboral.delete({ where: { id } });
    return { mensaje: `Turno ${id} eliminado correctamente` };
  }

  async importarTurnosCsv(buffer: Buffer) {
    const contenido = buffer.toString('utf8');
    const lineas = contenido.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lineas.length <= 1) {
      throw new BadRequestException('El archivo CSV está vacío o solo contiene encabezados');
    }

    const resultados = {
      importados: 0,
      errores: [] as { linea: number; motivo: string }[],
    };

    for (let i = 1; i < lineas.length; i++) {
      const valores = lineas[i].split(',').map((v) => v.trim());
      if (valores.length < 7) {
        resultados.errores.push({ linea: i + 1, motivo: 'Columnas insuficientes (se requieren al menos 7)' });
        continue;
      }

      const [idUsuario, idRuta, fecha, inicioProgramado, finProgramado, horasConduccion, esNocturno] = valores;

      try {
        await this.crearTurno({
          idUsuario,
          idRuta,
          fecha,
          inicioProgramado,
          finProgramado,
          horasConduccion: parseFloat(horasConduccion),
          esNocturno: esNocturno.toLowerCase() === 'true' || esNocturno === '1',
          estadoConfirmacion: 'pendiente',
        });
        resultados.importados++;
      } catch (err: any) {
        resultados.errores.push({ linea: i + 1, motivo: err.message ?? 'Error desconocido' });
      }
    }

    return resultados;
  }
}
