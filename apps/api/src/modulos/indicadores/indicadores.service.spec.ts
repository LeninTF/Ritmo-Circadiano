import { Test, TestingModule } from '@nestjs/testing';
import { IndicadoresService } from './indicadores.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('IndicadoresService (CP-13 k-anonymity)', () => {
  let service: IndicadoresService;

  const mockPrismaService: any = {
    turnoLaboral: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IndicadoresService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<IndicadoresService>(IndicadoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('obtenerPanel (RF13)', () => {
    it('debe retornar { suficiente: false } cuando n < 5 (CP-13a)', async () => {
      // 3 conductores únicos (< 5)
      mockPrismaService.turnoLaboral.findMany.mockResolvedValue([
        { idUsuario: 'user-1', horasConduccion: 4, esNocturno: false },
        { idUsuario: 'user-2', horasConduccion: 5, esNocturno: true },
        { idUsuario: 'user-3', horasConduccion: 3, esNocturno: false },
      ]);

      const resultado = await service.obtenerPanel('2026-10-01', '2026-10-07');
      expect(resultado).toEqual({ suficiente: false });
    });

    it('debe retornar { suficiente: true, datos: ... } cuando n >= 5 (CP-13b)', async () => {
      // 5 conductores únicos (>= 5)
      mockPrismaService.turnoLaboral.findMany.mockResolvedValue([
        { idUsuario: 'user-1', horasConduccion: 4, esNocturno: false },
        { idUsuario: 'user-2', horasConduccion: 5, esNocturno: true },
        { idUsuario: 'user-3', horasConduccion: 3, esNocturno: false },
        { idUsuario: 'user-4', horasConduccion: 4, esNocturno: true },
        { idUsuario: 'user-5', horasConduccion: 4, esNocturno: false },
        { idUsuario: 'user-1', horasConduccion: 2, esNocturno: false }, // duplicado usuario 1
      ]);

      const resultado = await service.obtenerPanel('2026-10-01', '2026-10-07');
      expect(resultado).toEqual({
        suficiente: true,
        datos: {
          conductoresUnicos: 5,
          totalTurnos: 6,
          promedioHorasConduccion: 3.67,
          turnosNocturnos: 2,
        },
      });
    });
  });
});
