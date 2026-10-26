
import { Test, TestingModule } from '@nestjs/testing';
import { HistorialService } from './historial.service';
import { DiarioService } from '../trabajador/diario.service';
import { CafeinaService } from '../cafeina/cafeina.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import type { DiarioRespuestaDto } from '@circadiano/contracts';

describe('HistorialService', () => {
  let service: HistorialService;
  let diarioService: DiarioService;
  let cafeina: CafeinaService;
  let notificaciones: NotificacionesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistorialService,
        {
          provide: DiarioService,
          useValue: {
            consultarDiarios: jest.fn(),
          },
        },
        {
          provide: CafeinaService,
          useValue: {
            consultarIngestasEnRango: jest.fn(),
          },
        },
        { provide: NotificacionesService, useValue: { consultarAbiertasEnRango: jest.fn() } },
      ],
    }).compile();

    service = module.get<HistorialService>(HistorialService);
    diarioService = module.get<DiarioService>(DiarioService);
    cafeina = module.get(CafeinaService);
    notificaciones = module.get(NotificacionesService);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('termina el historial en el día civil de Lima y conserva orden cronológico', async () => {
    jest.useFakeTimers();
    // 20 de octubre UTC = 19 de octubre, 22:00 en Lima.
    jest.setSystemTime(new Date('2026-10-20T03:00:00Z'));
    (diarioService.consultarDiarios as jest.Mock).mockResolvedValue([]);
    (cafeina.consultarIngestasEnRango as jest.Mock).mockResolvedValue([]);
    const programadas = [
      new Date('2026-10-19T04:59:59.999Z'), // día anterior en Lima
      new Date('2026-10-19T05:00:00Z'), // inicio incluido
      new Date('2026-10-20T03:00:00Z'), // 22:00 del día 19 en Lima
      new Date('2026-10-20T05:00:00Z'), // día siguiente, excluido
    ];
    (notificaciones.consultarAbiertasEnRango as jest.Mock).mockImplementation(
      async (_id, desde, hasta) => programadas.filter(
        (fecha) => fecha >= desde && fecha < hasta,
      ).map((programada_para) => ({ programada_para })),
    );

    const resultado = await service.getHistorial('u1', 7);

    expect(diarioService.consultarDiarios).toHaveBeenCalledWith('u1', '2026-10-13', '2026-10-19');
    expect(resultado.dias.map((dia) => dia.fecha)).toEqual([
      '2026-10-13', '2026-10-14', '2026-10-15', '2026-10-16',
      '2026-10-17', '2026-10-18', '2026-10-19',
    ]);
    expect(resultado.dias[6].notificacionesAbiertas).toBe(2);
    expect(notificaciones.consultarAbiertasEnRango).toHaveBeenCalledTimes(1);
  });

  it('debe devolver la cantidad correcta de días', async () => {
    // Mock data: fecha base 2026-10-20
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-10-20T00:00:00Z'));

    const diaries: DiarioRespuestaDto[] = [
      {
        id: '1',
        idUsuario: 'u1',
        fecha: '2026-10-18',
        horaAcostarse: '2026-10-18T22:00:00Z',
        horaDespertar: '2026-10-19T06:00:00Z',
        latenciaMin: 0,
        despertares: 0,
        calidadPercibida: 3,
        fatigaPercibida: 3,
        esDiaLaboral: true,
        luzMatutinaMin: 0,
        clientId: 'client',
        updatedAt: '2026-10-18T23:00:00Z',
      },
      {
        id: '2',
        idUsuario: 'u1',
        fecha: '2026-10-20',
        horaAcostarse: '2026-10-20T22:00:00Z',
        horaDespertar: '2026-10-21T06:00:00Z',
        latenciaMin: 0,
        despertares: 0,
        calidadPercibida: 3,
        fatigaPercibida: 3,
        esDiaLaboral: true,
        luzMatutinaMin: 0,
        clientId: 'client',
        updatedAt: '2026-10-20T23:00:00Z',
      },
    ];
    (diarioService.consultarDiarios as jest.Mock).mockResolvedValue(diaries);

    // Mock ingestas de cafeína: una ingesta antes del primer día de sueño
    const ingestas = [
      {
        id_ingesta: '1',
        id_usuario: 'u1',
        id_bebida: 'b1',
        cafeina_mg: 100,
        fecha_hora: new Date('2026-10-18T15:00:00Z'), // 15:00 UTC = 10:00 Lima
        residual_estimado_mg: null,
        client_id: 'c1',
      },
    ];
    (cafeina.consultarIngestasEnRango as jest.Mock).mockResolvedValue(ingestas);

    // Mock notifications: 1 open for first day, 0 for others
    (notificaciones.consultarAbiertasEnRango as jest.Mock).mockResolvedValue([{ programada_para: new Date('2026-10-18T12:00:00Z') }]);

    const result = await service.getHistorial('u1', 7);
    expect(result.dias).toHaveLength(7);
    const day18 = result.dias.find((d) => d.fecha === '2026-10-18');
    expect(day18?.horasSueno).toBeCloseTo(8);
    expect(day18?.cafeinaResidual).toBeGreaterThan(0);
    expect(day18?.diarioRegistrado).toBe(true);
    expect(day18?.notificacionesAbiertas).toBe(1);
    const day19 = result.dias.find((d) => d.fecha === '2026-10-19');
    expect(day19?.horasSueno).toBeNull();
    expect(day19?.cafeinaResidual).toBeNull();
    expect(day19?.diarioRegistrado).toBe(false);
    expect(day19?.notificacionesAbiertas).toBe(0);
  });
});
