import { Test, TestingModule } from '@nestjs/testing';
import { NotificacionesService } from './notificaciones.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as webPush from 'web-push';

jest.mock('web-push', () => ({
  setVapidDetails: jest.fn(),
  sendNotification: jest.fn(),
}));

describe('NotificacionesService', () => {
  let service: NotificacionesService;

  const mockPrismaService = {
    suscripcionPush: {
      upsert: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    notificacion: {
      update: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'VAPID_PUBLIC_KEY') return 'test-pub';
      if (key === 'VAPID_PRIVATE_KEY') return 'test-priv';
      return null;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificacionesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<NotificacionesService>(NotificacionesService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe marcar una notificación como abierta', async () => {
    const fechaMock = new Date();
    mockPrismaService.notificacion.update.mockResolvedValue({
      id_notificacion: 1,
      id_usuario: 'usr-1',
      id_plan: 10,
      tipo: 'luz',
      programada_para: fechaMock,
      enviada_en: fechaMock,
      estado: 'enviada',
      abierta: true,
    });

    const resultado = await service.marcarAbierta(1, 'usr-1');
    expect(resultado.abierta).toBe(true);
    expect(mockPrismaService.notificacion.update).toHaveBeenCalledWith({
      where: { id_notificacion: 1, id_usuario: 'usr-1' },
      data: { abierta: true },
    });
  });

  it('una notificacion ajena o inexistente da 404', async () => {
    mockPrismaService.notificacion.update.mockRejectedValueOnce(new Error('P2025'));
    await expect(service.marcarAbierta(1, 'otro')).rejects.toThrow('Notificacion no encontrada');
  });

  it('debe encolar una nueva notificación', async () => {
    const fechaIso = new Date().toISOString();
    const fechaMock = new Date(fechaIso);
    mockPrismaService.notificacion.create.mockResolvedValue({
      id_notificacion: 2,
      id_usuario: 'usr-1',
      id_plan: 10,
      tipo: 'corte_cafeina',
      programada_para: fechaMock,
      estado: 'pendiente',
      abierta: false,
    });

    const resultado = await service.encolar({
      id_usuario: 'usr-1',
      id_plan: 10,
      tipo: 'corte_cafeina',
      programada_para: fechaIso,
    });

    expect(resultado.id_notificacion).toBe(2);
    expect(resultado.tipo).toBe('corte_cafeina');
    expect(mockPrismaService.notificacion.create).toHaveBeenCalled();
  });

  it('debe manejar el envío push y eliminar suscripción si responde 410', async () => {
    const ahora = new Date();
    mockPrismaService.notificacion.findMany.mockResolvedValue([
      {
        id_notificacion: 5,
        id_usuario: 'usr-1',
        tipo: 'dormir',
        programada_para: new Date(ahora.getTime() - 10000),
      },
    ]);

    mockPrismaService.suscripcionPush.findMany.mockResolvedValue([
      {
        endpoint: 'https://push.example/sub1',
        clave_p256dh: 'p256',
        clave_auth: 'auth',
      },
    ]);

    const error410 = new Error('Gone') as Error & { statusCode?: number };
    error410.statusCode = 410;
    (webPush.sendNotification as jest.Mock).mockRejectedValueOnce(error410);

    await service.procesarNotificacionesPendientes();

    expect(webPush.sendNotification).toHaveBeenCalled();
    expect(mockPrismaService.suscripcionPush.delete).toHaveBeenCalledWith({
      where: { endpoint: 'https://push.example/sub1' },
    });
    expect(mockPrismaService.notificacion.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id_notificacion: 5 },
        data: expect.objectContaining({ estado: 'fallida' }),
      }),
    );
  });

  // ─── Pruebas de auditoría RF10 ────────────────────────────────────────────────

  it('[RF10] un plan con hora de corte 14:30 genera la notificación corte_cafeina a las 14:30', async () => {
    const horaCorte = '2026-10-25T14:30:00.000Z';
    mockPrismaService.notificacion.updateMany.mockResolvedValue({ count: 0 });
    mockPrismaService.notificacion.create.mockResolvedValue({
      id_notificacion: 10,
      id_usuario: 'usr-rf10',
      id_plan: null,
      tipo: 'corte_cafeina',
      programada_para: new Date(horaCorte),
      estado: 'pendiente',
      abierta: false,
    });

    await service.handlePlanGenerado({
      id_usuario: 'usr-rf10',
      id_plan: 'plan-uuid-001',
      fecha: '2026-10-25',
      recordatorios: [{ tipo: 'corte_cafeina', programadaPara: horaCorte }],
    });

    expect(mockPrismaService.notificacion.create).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.notificacion.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tipo: 'corte_cafeina',
          programada_para: new Date(horaCorte),
        }),
      }),
    );
  });

  it('[RF10] al regenerar el plan, cancela notificaciones pendientes previas sin duplicar registros', async () => {
    mockPrismaService.notificacion.updateMany.mockResolvedValue({ count: 2 });
    const fechaRelajacion = '2026-10-25T21:30:00.000Z';
    const fechaDormir = '2026-10-25T22:00:00.000Z';
    let createCall = 0;
    mockPrismaService.notificacion.create.mockImplementation(() => {
      createCall++;
      return Promise.resolve({
        id_notificacion: createCall,
        id_usuario: 'usr-rf10b',
        id_plan: null,
        tipo: createCall === 1 ? 'relajacion' : 'dormir',
        programada_para: createCall === 1 ? new Date(fechaRelajacion) : new Date(fechaDormir),
        estado: 'pendiente',
        abierta: false,
      });
    });

    await service.handlePlanGenerado({
      id_usuario: 'usr-rf10b',
      id_plan: 'plan-uuid-002',
      fecha: '2026-10-25',
      recordatorios: [
        { tipo: 'relajacion', programadaPara: fechaRelajacion },
        { tipo: 'dormir', programadaPara: fechaDormir },
      ],
    });

    expect(mockPrismaService.notificacion.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { estado: 'cancelada' },
        where: expect.objectContaining({ id_usuario: 'usr-rf10b', estado: 'pendiente' }),
      }),
    );
    // Exactamente 2 nuevas notificaciones — sin duplicados
    expect(mockPrismaService.notificacion.create).toHaveBeenCalledTimes(2);
  });

  it('[RF10] un plan nocturno con protección de luz no genera notificación de tipo "luz"', async () => {
    mockPrismaService.notificacion.updateMany.mockResolvedValue({ count: 0 });
    mockPrismaService.notificacion.create.mockResolvedValue({
      id_notificacion: 20,
      id_usuario: 'usr-nocturno',
      id_plan: null,
      tipo: 'relajacion',
      programada_para: new Date('2026-10-26T06:30:00.000Z'),
      estado: 'pendiente',
      abierta: false,
    });

    // protegerLuz=true → derivarRecordatorios no incluye 'luz'
    await service.handlePlanGenerado({
      id_usuario: 'usr-nocturno',
      id_plan: 'plan-uuid-003',
      fecha: '2026-10-26',
      recordatorios: [
        { tipo: 'relajacion', programadaPara: '2026-10-26T06:30:00.000Z' },
        { tipo: 'dormir', programadaPara: '2026-10-26T07:00:00.000Z' },
      ],
    });

    const tiposGenerados = (mockPrismaService.notificacion.create.mock.calls as Array<[{ data: { tipo: string } }]>)
      .map(([args]) => args.data.tipo);
    expect(tiposGenerados).not.toContain('luz');
    expect(tiposGenerados).toEqual(expect.arrayContaining(['relajacion', 'dormir']));
    expect(mockPrismaService.notificacion.create).toHaveBeenCalledTimes(2);
  });
});

