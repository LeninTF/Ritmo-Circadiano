import { Injectable, NotFoundException, BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TURNO_ASIGNADO, TurnoAsignadoEvento } from '@circadiano/contracts';
import { validarJornadaRN01, detectarTurnoNocturno } from '@circadiano/domain';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { CrearTurnoDto } from './dto/crear-turno.dto';
import { ActualizarTurnoDto } from './dto/actualizar-turno.dto';
import { ConfirmarTurnoDto } from './dto/confirmar-turno.dto';

@Injectable()
export class OperacionesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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

  async listarTurnosMe(idUsuario: string, desde?: string, hasta?: string) {
    if (!idUsuario) {
      throw new BadRequestException('ID de usuario requerido para listar turnos propios.');
    }
    const where: Prisma.TurnoLaboralWhereInput = {
      idUsuario,
    };

    if (desde || hasta) {
      where.fecha = {};
      if (desde) {
        (where.fecha as Prisma.DateTimeFilter).gte = new Date(desde);
      }
      if (hasta) {
        const fechaFin = new Date(hasta);
        fechaFin.setDate(fechaFin.getDate() + 1);
        (where.fecha as Prisma.DateTimeFilter).lt = fechaFin;
      }
    }

    return this.prisma.turnoLaboral.findMany({
      where,
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

  private async validarYRegistrarExcesoJornadaTx(
    tx: Prisma.TransactionClient,
    idUsuario: string,
    fechaStr: string,
    horasConduccion: number,
    esNocturno: boolean,
    confirmarExceso?: boolean,
    motivoExceso?: string,
    idTurnoExcluir?: string,
    idTurnoCreado?: string,
  ) {
    const fechaDate = new Date(fechaStr);

    const turnosExistentes = await tx.turnoLaboral.findMany({
      where: {
        idUsuario,
        fecha: fechaDate,
        ...(idTurnoExcluir ? { id: { not: idTurnoExcluir } } : {}),
      },
      select: { horasConduccion: true },
    });

    const horasAcumuladasPrevias = turnosExistentes.reduce(
      (acc: number, t: { horasConduccion: Prisma.Decimal | number }) => acc + Number(t.horasConduccion),
      0,
    );
    const horasTotalesDia = horasAcumuladasPrevias + horasConduccion;

    const resultadoRN01 = validarJornadaRN01({
      horasConduccion,
      horasAcumuladasDia: horasTotalesDia,
      esNocturno,
    });

    const superaContinuo = resultadoRN01.superaContinuo;
    const superaDiario = resultadoRN01.superaDiario;
    const LIMITE_CONTINUO = resultadoRN01.limiteContinuo;
    const LIMITE_DIARIO = resultadoRN01.limiteDiario;

    if (superaContinuo || superaDiario) {
      if (!confirmarExceso) {
        throw new ConflictException({
          mensaje: 'Exceso de jornada laboral detectado (RF14 / RN01). Se requiere confirmación explícita (confirmarExceso: true) y motivo.',
          horasConduccionTurno: horasConduccion,
          limiteContinuoMax: LIMITE_CONTINUO,
          horasAcumuladasDia: horasTotalesDia,
          limiteDiarioMax: LIMITE_DIARIO,
          superaContinuo,
          superaDiario,
          requiereConfirmacion: true,
        });
      }

      if (!motivoExceso || motivoExceso.trim().length === 0) {
        throw new BadRequestException('Se requiere ingresar un motivo de justificación (motivoExceso) para aprobar el exceso de jornada laboral (RF14).');
      }

      await tx.excesoJornadaAuditoria.create({
        data: {
          idTurno: idTurnoCreado ?? null,
          idUsuario,
          fecha: fechaDate,
          horasConduccion,
          motivoExceso,
        },
      });
    }
  }

  async crearTurno(dto: CrearTurnoDto) {
    const ruta = await this.prisma.ruta.findUnique({ where: { id: dto.idRuta } });
    if (!ruta) {
      throw new BadRequestException(`Ruta con ID ${dto.idRuta} no existe`);
    }

    const esNocturnoCalculado = dto.esNocturno ?? detectarTurnoNocturno(dto.inicioProgramado, dto.finProgramado);

    const turno = await this.prisma.$transaction(async (tx) => {
      const nuevoTurno = await tx.turnoLaboral.create({
        data: {
          idUsuario: dto.idUsuario,
          idRuta: dto.idRuta,
          fecha: new Date(dto.fecha),
          inicioProgramado: new Date(dto.inicioProgramado),
          finProgramado: new Date(dto.finProgramado),
          horasConduccion: dto.horasConduccion,
          esNocturno: esNocturnoCalculado,
          estadoConfirmacion: dto.estadoConfirmacion ?? 'pendiente',
          horaInicioReal: dto.horaInicioReal ? new Date(dto.horaInicioReal) : null,
          horaFinReal: dto.horaFinReal ? new Date(dto.horaFinReal) : null,
        },
        include: { ruta: true },
      });

      await this.validarYRegistrarExcesoJornadaTx(
        tx,
        dto.idUsuario,
        dto.fecha,
        dto.horasConduccion,
        esNocturnoCalculado,
        dto.confirmarExceso,
        dto.motivoExceso,
        undefined,
        nuevoTurno.id,
      );

      return nuevoTurno;
    });

    const evento: TurnoAsignadoEvento = {
      idTurno: turno.id,
      idUsuario: turno.idUsuario,
      fecha: turno.fecha instanceof Date ? turno.fecha.toISOString().split('T')[0] : String(turno.fecha).substring(0, 10),
    };
    this.eventEmitter.emit(TURNO_ASIGNADO, evento);
    this.eventEmitter.emit('turno.asignado', evento);

    return turno;
  }

  async actualizarTurno(id: string, dto: ActualizarTurnoDto) {
    const turnoActualizado = await this.prisma.$transaction(async (tx) => {
      const turnoActual = await tx.turnoLaboral.findUnique({ where: { id } });
      if (!turnoActual) {
        throw new NotFoundException(`Turno con ID ${id} no encontrado`);
      }

      if (dto.idRuta) {
        const ruta = await tx.ruta.findUnique({ where: { id: dto.idRuta } });
        if (!ruta) {
          throw new BadRequestException(`Ruta con ID ${dto.idRuta} no existe`);
        }
      }

      const idUsuarioFinal = dto.idUsuario ?? turnoActual.idUsuario;
      const fechaFinalStr = dto.fecha ?? turnoActual.fecha.toISOString().split('T')[0];
      const horasConduccionFinal = dto.horasConduccion !== undefined ? dto.horasConduccion : Number(turnoActual.horasConduccion);
      const inicioProgFinal = dto.inicioProgramado ?? turnoActual.inicioProgramado.toISOString();
      const finProgFinal = dto.finProgramado ?? turnoActual.finProgramado.toISOString();
      const esNocturnoFinal = dto.esNocturno ?? turnoActual.esNocturno ?? detectarTurnoNocturno(inicioProgFinal, finProgFinal);

      await this.validarYRegistrarExcesoJornadaTx(
        tx,
        idUsuarioFinal,
        fechaFinalStr,
        horasConduccionFinal,
        esNocturnoFinal,
        dto.confirmarExceso,
        dto.motivoExceso,
        id,
        id,
      );

      return tx.turnoLaboral.update({
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
    });

    const evento: TurnoAsignadoEvento = {
      idTurno: turnoActualizado.id,
      idUsuario: turnoActualizado.idUsuario,
      fecha: turnoActualizado.fecha instanceof Date ? turnoActualizado.fecha.toISOString().split('T')[0] : String(turnoActualizado.fecha).substring(0, 10),
    };
    this.eventEmitter.emit(TURNO_ASIGNADO, evento);
    this.eventEmitter.emit('turno.asignado', evento);

    return turnoActualizado;
  }

  /**
   * RF05 / ERD05 — Confirmar o corregir un turno laboral.
   *
   * Reglas:
   * - Solo se aceptan los estados `confirmado` y `corregido`.
   *   El valor `pendiente` existe en el enum compartido para otros módulos,
   *   pero NO es una operación válida en este endpoint.
   * - Idempotencia: si el turno ya tiene el mismo estado (y mismas horas reales
   *   en caso de corrección), se retorna el turno sin actualizar ni emitir evento.
   * - Al corregir se comparan las horas reales existentes con las solicitadas.
   * - Se verifica propiedad del turno (idUsuario === idUsuarioAutenticado).
   *
   * Nota: `origen_registro` sigue pendiente de coordinación con el equipo de I2/I4.
   */
  async confirmarTurno(id: string, idUsuarioAutenticado: string, dto: ConfirmarTurnoDto) {
    if (!idUsuarioAutenticado) {
      throw new BadRequestException('ID de usuario autenticado requerido.');
    }

    const { estadoConfirmacion, horaInicioReal, horaFinReal } = dto;

    // ── Guard: `pendiente` no es una operación válida para este endpoint ──
    if (estadoConfirmacion === 'pendiente') {
      throw new BadRequestException(
        'El estado "pendiente" no es una operación válida para confirmar o corregir un turno.',
      );
    }

    const turno = await this.prisma.turnoLaboral.findUnique({
      where: { id },
      include: { ruta: true },
    });

    if (!turno) {
      throw new NotFoundException(`Turno con ID ${id} no encontrado.`);
    }

    // ── Verificación de propiedad ──
    if (turno.idUsuario !== idUsuarioAutenticado) {
      throw new ForbiddenException('No autorizado: este turno no pertenece al trabajador autenticado.');
    }

    // ── Validaciones para corrección ──
    if (estadoConfirmacion === 'corregido') {
      if (!horaInicioReal || !horaFinReal) {
        throw new BadRequestException('Se requieren horaInicioReal y horaFinReal válidas para corregir el turno.');
      }
      const inicioRealDate = new Date(horaInicioReal);
      const finRealDate = new Date(horaFinReal);
      if (isNaN(inicioRealDate.getTime()) || isNaN(finRealDate.getTime())) {
        throw new BadRequestException('Las fechas de hora real deben ser timestamps ISO válidos.');
      }
      if (finRealDate <= inicioRealDate) {
        throw new BadRequestException('La hora de fin real debe ser posterior a la hora de inicio real.');
      }
    }

    // ── Idempotencia: confirmación repetida ──
    if (estadoConfirmacion === 'confirmado' && turno.estadoConfirmacion === 'confirmado') {
      return turno;
    }

    // ── Idempotencia: corrección repetida con mismos datos ──
    if (estadoConfirmacion === 'corregido' && turno.estadoConfirmacion === 'corregido') {
      const inicioRealExistente = turno.horaInicioReal instanceof Date
        ? turno.horaInicioReal.toISOString()
        : turno.horaInicioReal ? String(turno.horaInicioReal) : null;
      const finRealExistente = turno.horaFinReal instanceof Date
        ? turno.horaFinReal.toISOString()
        : turno.horaFinReal ? String(turno.horaFinReal) : null;

      const inicioSolicitado = horaInicioReal ? new Date(horaInicioReal).toISOString() : null;
      const finSolicitado = horaFinReal ? new Date(horaFinReal).toISOString() : null;

      if (inicioRealExistente === inicioSolicitado && finRealExistente === finSolicitado) {
        return turno;
      }
    }

    // ── Actualización ──
    const dataUpdate: Prisma.TurnoLaboralUpdateInput = {
      estadoConfirmacion,
      horaInicioReal: estadoConfirmacion === 'corregido'
        ? new Date(horaInicioReal!)
        : (estadoConfirmacion === 'confirmado' ? turno.inicioProgramado : undefined),
      horaFinReal: estadoConfirmacion === 'corregido'
        ? new Date(horaFinReal!)
        : (estadoConfirmacion === 'confirmado' ? turno.finProgramado : undefined),
    };

    const turnoActualizado = await this.prisma.turnoLaboral.update({
      where: { id },
      data: dataUpdate,
      include: { ruta: true },
    });

    // Si se ha corregido el turno, emitir TURNO_ASIGNADO para regenerar el plan circadiano (I3)
    if (estadoConfirmacion === 'corregido') {
      const evento: TurnoAsignadoEvento = {
        idTurno: turnoActualizado.id,
        idUsuario: turnoActualizado.idUsuario,
        fecha: turnoActualizado.fecha instanceof Date ? turnoActualizado.fecha.toISOString().split('T')[0] : String(turnoActualizado.fecha).substring(0, 10),
      };
      this.eventEmitter.emit(TURNO_ASIGNADO, evento);
    }

    // Dependencia pendiente I4: NotificacionService.encolar({ idUsuario: turnoActualizado.idUsuario, mensaje: 'Turno confirmado/corregido' })
    // origen_registro: pendiente de coordinación con el equipo de I2/I4 — no se modifica el esquema Prisma de I2.

    return turnoActualizado;
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
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
        resultados.errores.push({ linea: i + 1, motivo: errorMsg });
      }
    }

    return resultados;
  }
}
