import { Test, TestingModule } from '@nestjs/testing';
import { DiarioController } from './diario.controller';
import { DiarioService } from './diario.service';
import { UnauthorizedException } from '@nestjs/common';

describe('DiarioController', () => {
  let controller: DiarioController;
  let service: DiarioService;

  const mockDiarioService = {
    upsertDiario: jest.fn().mockImplementation((idUsuario, fecha, dto) => Promise.resolve({ id: '1', idUsuario, fecha, ...dto })),
    consultarDiarios: jest.fn().mockImplementation((idUsuario, desde, hasta) => Promise.resolve([{ id: '1', idUsuario, fecha: desde }])),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiarioController],
      providers: [
        {
          provide: DiarioService,
          useValue: mockDiarioService,
        },
      ],
    }).compile();

    controller = module.get<DiarioController>(DiarioController);
    service = module.get<DiarioService>(DiarioService);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debe realizar upsert de diario extrayendo el usuario del request autenticado (req.user)', async () => {
    const req = { user: { id: 'user-1' } };
    const dto = {
      clientId: '123e4567-e89b-12d3-a456-426614174000',
      horaAcostarse: '2026-10-20T22:00:00Z',
      horaDespertar: '2026-10-21T06:00:00Z',
      latenciaMin: 10,
      despertares: 0,
      calidadPercibida: 5,
      fatigaPercibida: 1,
      esDiaLaboral: true,
      luzMatutinaMin: 30,
    };

    const resultado = await controller.upsertDiario('2026-10-21', dto, req);
    expect(resultado).toBeDefined();
    expect(resultado.idUsuario).toBe('user-1');
    expect(resultado.fecha).toBe('2026-10-21');
    expect(service.upsertDiario).toHaveBeenCalledWith('user-1', '2026-10-21', dto);
  });

  it('debe lanzar UnauthorizedException si el request no tiene usuario autenticado', async () => {
    const req = {};
    const dto = {} as any;
    await expect(controller.upsertDiario('2026-10-21', dto, req)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('debe ignorar y rechazar cabeceras falsificadas x-usuario-id (prevenir suplantación de identidad)', async () => {
    // Intento de suplantación enviando x-usuario-id pero sin req.user / req.usuario legítimo
    const req = { headers: { 'x-usuario-id': 'hacker-user-id' } };
    const dto = {} as any;
    await expect(controller.upsertDiario('2026-10-21', dto, req)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('debe consultar diarios filtrando por rango con usuario autenticado legítimo', async () => {
    const req = { user: { id: 'user-2' }, headers: { 'x-usuario-id': 'hacker-user-id' } };
    const resultado = await controller.consultarDiarios('2026-10-01', '2026-10-21', req);
    expect(resultado).toBeDefined();
    expect(resultado).toHaveLength(1);
    expect(service.consultarDiarios).toHaveBeenCalledWith('user-2', '2026-10-01', '2026-10-21');
  });
});
