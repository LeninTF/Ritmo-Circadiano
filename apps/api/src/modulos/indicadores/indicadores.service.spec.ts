import { Test, TestingModule } from '@nestjs/testing';
import { IndicadoresService } from './indicadores.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('IndicadoresService (CP-13 k-anonymity)', () => {
  let service: IndicadoresService;

  const mockPrismaService = {
    $queryRawUnsafe: jest.fn(),
  };

  const usuarios = (n: number) =>
    Array.from({ length: n }, (_, i) => ({ id_usuario: `user-${i + 1}` }));

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
      mockPrismaService.$queryRawUnsafe.mockResolvedValueOnce(usuarios(3));

      const resultado = await service.obtenerPanel('2026-10-01', '2026-10-07');

      expect(resultado).toEqual({ suficiente: false });
      // Con n < 5 no se consulta ninguna vista de indicadores
      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalledTimes(1);
    });

    it('debe retornar { suficiente: true, datos: ... } cuando n >= 5 (CP-13b)', async () => {
      mockPrismaService.$queryRawUnsafe
        .mockResolvedValueOnce(usuarios(5))
        .mockResolvedValueOnce([{ prom_descanso: '9.5' }])
        .mockResolvedValueOnce([{ turnos_nocturnos: '2', prom_horas: '3.666' }])
        .mockResolvedValueOnce([{ total: '6', completados: '3' }]);

      const resultado = await service.obtenerPanel('2026-10-01', '2026-10-07');

      expect(resultado).toEqual({
        suficiente: true,
        datos: {
          conductoresUnicos: 5,
          totalTurnos: 6,
          promedioHorasConduccion: 3.67,
          promedioHorasDescanso: 9.5,
          turnosNocturnos: 2,
          porcentajeAdherencia: 50,
        },
      });
    });
  });
});
