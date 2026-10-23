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
});
