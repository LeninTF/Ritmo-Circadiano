import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TURNO_ASIGNADO } from '@circadiano/contracts';
import { OperacionesService } from './operaciones.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('OperacionesService', () => {
  let service: OperacionesService;

  const mockPrismaService: any = {
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
    $transaction: jest.fn(async (callback) => callback(mockPrismaService)),
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
      expect(mockPrismaService.excesoJornadaAuditoria.create).toHaveBeenCalled();
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
