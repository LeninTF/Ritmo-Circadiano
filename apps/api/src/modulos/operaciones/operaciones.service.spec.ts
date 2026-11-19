import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TURNO_ASIGNADO } from '@circadiano/contracts';
import { OperacionesService } from './operaciones.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfirmarTurnoDto } from './dto/confirmar-turno.dto';

describe('OperacionesService', () => {
  let service: OperacionesService;

  const mockPrismaService = {
    ruta: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    turnoLaboral: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    excesoJornadaAuditoria: {
      create: jest.fn(),
    },
    $transaction: jest.fn(async (callback: (tx: unknown) => unknown): Promise<unknown> => callback(mockPrismaService)),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OperacionesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<OperacionesService>(OperacionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listarRutas', () => {
    it('debe listar las rutas activas', async () => {
      const rutasMock = [{ id: 'r-1', nombre: 'Ruta 1', activa: true }];
      mockPrismaService.ruta.findMany.mockResolvedValue(rutasMock);
      expect(await service.listarRutas()).toEqual(rutasMock);
      expect(mockPrismaService.ruta.findMany).toHaveBeenCalledWith({ where: { activa: true } });
    });
  });

  describe('listarTurnosMe', () => {
    it('debe lanzar BadRequestException si idUsuario está vacío', async () => {
      await expect(service.listarTurnosMe('')).rejects.toThrow(BadRequestException);
    });

    it('debe listar los turnos propios del usuario', async () => {
      const turnosMock = [{ id: 't-1', idUsuario: 'u-1' }];
      mockPrismaService.turnoLaboral.findMany.mockResolvedValue(turnosMock);
      expect(await service.listarTurnosMe('u-1', '2026-10-01', '2026-10-05')).toEqual(turnosMock);
    });
  });

  describe('crearTurno (RF14 y Eventos)', () => {
    const dtoBase = {
      idUsuario: 'u-1',
      idRuta: 'r-1',
      fecha: '2026-10-20',
      inicioProgramado: '2026-10-20T08:00:00.000Z',
      finProgramado: '2026-10-20T12:00:00.000Z',
      horasConduccion: 4,
      esNocturno: false,
    };

    it('debe crear un turno exitosamente y emitir TURNO_ASIGNADO', async () => {
      mockPrismaService.ruta.findUnique.mockResolvedValue({ id: 'r-1', activa: true });
      mockPrismaService.turnoLaboral.findMany.mockResolvedValue([]);
      const creado = { id: 't-new', idUsuario: 'u-1', fecha: new Date('2026-10-20') };
      mockPrismaService.turnoLaboral.create.mockResolvedValue(creado);

      const res = await service.crearTurno(dtoBase);
      expect(res).toEqual(creado);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(TURNO_ASIGNADO, {
        idTurno: 't-new',
        idUsuario: 'u-1',
        fecha: '2026-10-20',
      });
    });

    it('debe lanzar ConflictException si excede límite continuo (5h) sin confirmación (RF14)', async () => {
      mockPrismaService.ruta.findUnique.mockResolvedValue({ id: 'r-1', activa: true });
      mockPrismaService.turnoLaboral.findMany.mockResolvedValue([]);
      await expect(service.crearTurno({ ...dtoBase, horasConduccion: 6, confirmarExceso: false })).rejects.toThrow(
        ConflictException,
      );
    });

    it('RN01: 3 h previas + 4 h nuevas se acepta y el turno nuevo no se cuenta dos veces', async () => {
      mockPrismaService.ruta.findUnique.mockResolvedValue({ id: 'r-1', activa: true });
      mockPrismaService.turnoLaboral.findMany.mockResolvedValue([
        { inicioProgramado: new Date('2026-10-20T07:00:00-05:00'), horasConduccion: 3 },
      ]);
      mockPrismaService.turnoLaboral.create.mockResolvedValue({ id: 't-7h', idUsuario: 'u-1', fecha: new Date('2026-10-20') });

      await service.crearTurno({ ...dtoBase, inicioProgramado: '2026-10-20T14:00:00-05:00', horasConduccion: 4 });
      // La consulta de RN01 corre antes de crear: el turno nuevo no puede aparecer en ella.
      expect(mockPrismaService.turnoLaboral.findMany.mock.invocationCallOrder[0]).toBeLessThan(
        mockPrismaService.turnoLaboral.create.mock.invocationCallOrder[0],
      );
      expect(mockPrismaService.excesoJornadaAuditoria.create).not.toHaveBeenCalled();
    });

    it('RN01: ventana movil entre dos dias (5 h + 3 h + 3 h en 24 h) responde 409 aunque cada dia tenga menos de 10 h', async () => {
      mockPrismaService.ruta.findUnique.mockResolvedValue({ id: 'r-1', activa: true });
      mockPrismaService.turnoLaboral.findMany.mockResolvedValue([
        { inicioProgramado: new Date('2026-10-20T16:00:00-05:00'), horasConduccion: 5 },
        { inicioProgramado: new Date('2026-10-21T06:00:00-05:00'), horasConduccion: 3 },
      ]);
      const error = await service
        .crearTurno({ ...dtoBase, fecha: '2026-10-21', inicioProgramado: '2026-10-21T10:00:00-05:00', horasConduccion: 3 })
        .catch((e: ConflictException) => e);
      expect(error).toBeInstanceOf(ConflictException);
      expect((error as ConflictException).getResponse()).toMatchObject({ superaVentana: true, horasAcumuladas24h: 11 });
      expect(mockPrismaService.turnoLaboral.create).not.toHaveBeenCalled();
    });

    it('debe permitir crear turno con exceso si se confirma y se provee motivoExceso (RF14)', async () => {
      mockPrismaService.ruta.findUnique.mockResolvedValue({ id: 'r-1', activa: true });
      mockPrismaService.turnoLaboral.findMany.mockResolvedValue([]);
      const creado = { id: 't-ex', idUsuario: 'u-1', fecha: new Date('2026-10-20') };
      mockPrismaService.turnoLaboral.create.mockResolvedValue(creado);
      mockPrismaService.excesoJornadaAuditoria.create.mockResolvedValue({});

      const res = await service.crearTurno({
        ...dtoBase,
        horasConduccion: 6,
        confirmarExceso: true,
        motivoExceso: 'Retraso imprevisto',
      });
      expect(res).toEqual(creado);
      expect(mockPrismaService.excesoJornadaAuditoria.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ idTurno: 't-ex', motivoExceso: 'Retraso imprevisto' }),
      });
    });
  });

  describe('confirmarTurno (RF05, ERD05)', () => {
    const turnoMock = {
      id: 't-1',
      idUsuario: 'u-1',
      idRuta: 'r-1',
      fecha: new Date('2026-10-20'),
      inicioProgramado: new Date('2026-10-20T08:00:00Z'),
      finProgramado: new Date('2026-10-20T12:00:00Z'),
      horasConduccion: 4,
      esNocturno: false,
      estadoConfirmacion: 'pendiente',
      horaInicioReal: null,
      horaFinReal: null,
      actualizadoEn: new Date('2026-10-19T10:00:00Z'),
    };

    it('debe confirmar un turno exitosamente', async () => {
      mockPrismaService.turnoLaboral.findUnique.mockResolvedValue(turnoMock);
      const actualizado = { ...turnoMock, estadoConfirmacion: 'confirmado' };
      mockPrismaService.turnoLaboral.update.mockResolvedValue(actualizado);

      const res = await service.confirmarTurno('t-1', 'u-1', { estadoConfirmacion: 'confirmado' });
      expect(res.estadoConfirmacion).toBe('confirmado');
      expect(mockPrismaService.turnoLaboral.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 't-1', actualizadoEn: turnoMock.actualizadoEn } }),
      );
    });

    it('debe responder 409 sin emitir evento si otra solicitud cambió el turno (concurrencia)', async () => {
      mockPrismaService.turnoLaboral.findUnique.mockResolvedValue(turnoMock);
      mockPrismaService.turnoLaboral.update.mockRejectedValue(Object.assign(new Error('no encontrado'), { code: 'P2025' }));

      await expect(
        service.confirmarTurno('t-1', 'u-1', {
          estadoConfirmacion: 'corregido',
          horaInicioReal: '2026-10-20T08:30:00Z',
          horaFinReal: '2026-10-20T12:30:00Z',
        }),
      ).rejects.toThrow(ConflictException);
      expect(mockEventEmitter.emit).not.toHaveBeenCalled();
    });

    it('debe corregir un turno exitosamente y emitir TURNO_ASIGNADO', async () => {
      mockPrismaService.turnoLaboral.findUnique.mockResolvedValue(turnoMock);
      const actualizado = {
        ...turnoMock,
        estadoConfirmacion: 'corregido',
        horaInicioReal: new Date('2026-10-20T08:30:00Z'),
        horaFinReal: new Date('2026-10-20T12:30:00Z'),
      };
      mockPrismaService.turnoLaboral.update.mockResolvedValue(actualizado);

      const res = await service.confirmarTurno('t-1', 'u-1', {
        estadoConfirmacion: 'corregido',
        horaInicioReal: '2026-10-20T08:30:00Z',
        horaFinReal: '2026-10-20T12:30:00Z',
      });

      expect(res.estadoConfirmacion).toBe('corregido');
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        TURNO_ASIGNADO,
        expect.objectContaining({ idTurno: 't-1', idUsuario: 'u-1' }),
      );
    });

    it('debe lanzar NotFoundException si el turno no existe', async () => {
      mockPrismaService.turnoLaboral.findUnique.mockResolvedValue(null);
      await expect(
        service.confirmarTurno('t-notfound', 'u-1', { estadoConfirmacion: 'confirmado' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar ForbiddenException si el usuario autenticado no es el dueño del turno', async () => {
      mockPrismaService.turnoLaboral.findUnique.mockResolvedValue(turnoMock);
      await expect(
        service.confirmarTurno('t-1', 'u-other', { estadoConfirmacion: 'confirmado' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe lanzar BadRequestException si faltan horas reales al corregir', async () => {
      mockPrismaService.turnoLaboral.findUnique.mockResolvedValue(turnoMock);
      await expect(
        service.confirmarTurno('t-1', 'u-1', { estadoConfirmacion: 'corregido' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('debe lanzar BadRequestException si la hora de fin real es anterior o igual a la de inicio real', async () => {
      mockPrismaService.turnoLaboral.findUnique.mockResolvedValue(turnoMock);
      await expect(
        service.confirmarTurno('t-1', 'u-1', {
          estadoConfirmacion: 'corregido',
          horaInicioReal: '2026-10-20T12:00:00Z',
          horaFinReal: '2026-10-20T10:00:00Z',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('debe lanzar BadRequestException al intentar volver a estado pendiente', async () => {
      mockPrismaService.turnoLaboral.findUnique.mockResolvedValue(turnoMock);
      await expect(
        service.confirmarTurno('t-1', 'u-1', { estadoConfirmacion: 'pendiente' } as unknown as ConfirmarTurnoDto),
      ).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.turnoLaboral.update).not.toHaveBeenCalled();
    });

    it('debe retornar el turno sin actualizar ni emitir evento si ya está confirmado (idempotencia)', async () => {
      const turnoYaConfirmado = {
        ...turnoMock,
        estadoConfirmacion: 'confirmado',
        horaInicioReal: new Date('2026-10-20T08:00:00Z'),
        horaFinReal: new Date('2026-10-20T12:00:00Z'),
      };
      mockPrismaService.turnoLaboral.findUnique.mockResolvedValue(turnoYaConfirmado);

      const res = await service.confirmarTurno('t-1', 'u-1', { estadoConfirmacion: 'confirmado' });

      expect(res).toEqual(turnoYaConfirmado);
      expect(mockPrismaService.turnoLaboral.update).not.toHaveBeenCalled();
      expect(mockEventEmitter.emit).not.toHaveBeenCalled();
    });

    it('debe retornar el turno sin actualizar ni emitir evento si ya está corregido con los mismos datos (idempotencia)', async () => {
      const turnoYaCorregido = {
        ...turnoMock,
        estadoConfirmacion: 'corregido',
        horaInicioReal: new Date('2026-10-20T08:30:00.000Z'),
        horaFinReal: new Date('2026-10-20T12:30:00.000Z'),
      };
      mockPrismaService.turnoLaboral.findUnique.mockResolvedValue(turnoYaCorregido);

      const res = await service.confirmarTurno('t-1', 'u-1', {
        estadoConfirmacion: 'corregido',
        horaInicioReal: '2026-10-20T08:30:00.000Z',
        horaFinReal: '2026-10-20T12:30:00.000Z',
      });

      expect(res).toEqual(turnoYaCorregido);
      expect(mockPrismaService.turnoLaboral.update).not.toHaveBeenCalled();
      expect(mockEventEmitter.emit).not.toHaveBeenCalled();
    });
  });

  describe('importarTurnosCsv', () => {
    it('debe lanzar BadRequestException si el CSV está vacío', async () => {
      await expect(service.importarTurnosCsv(Buffer.from('header1,header2\n', 'utf8'))).rejects.toThrow(BadRequestException);
    });

    it('debe importar filas válidas y registrar errores en filas inválidas', async () => {
      const csv = [
        'idUsuario,idRuta,fecha,inicioProgramado,finProgramado,horasConduccion,esNocturno',
        'u-1,r-1,2026-10-20,2026-10-20T08:00:00Z,2026-10-20T12:00:00Z,4,false',
        'linea-corta',
      ].join('\n');

      mockPrismaService.ruta.findUnique.mockResolvedValue({ id: 'r-1', activa: true });
      mockPrismaService.turnoLaboral.findMany.mockResolvedValue([]);
      mockPrismaService.turnoLaboral.create.mockResolvedValue({ id: 't-1', idUsuario: 'u-1', fecha: new Date('2026-10-20') });

      const res = await service.importarTurnosCsv(Buffer.from(csv, 'utf8'));
      expect(res.importados).toBe(1);
      expect(res.errores).toHaveLength(1);
    });
  });
});
