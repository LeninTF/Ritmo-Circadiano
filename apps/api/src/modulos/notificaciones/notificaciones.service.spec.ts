import { Test, TestingModule } from '@nestjs/testing';
import { NotificacionesService } from './notificaciones.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ServiceUnavailableException } from '@nestjs/common';
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
      createMany: jest.fn(),
      findMany: jest.fn(),
    },
    // Ejecuta las operaciones como lo haría Prisma con un arreglo.
    $transaction: jest.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
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
      id_plan: '10',
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
      id_plan: '10',
      tipo: 'corte_cafeina',
      programada_para: fechaMock,
      estado: 'pendiente',
      abierta: false,
    });

    const resultado = await service.encolar({
      id_usuario: 'usr-1',
      id_plan: '10',
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

  // ─── RF10: recordatorios desde el plan ────────────────────────────────────────

  const enHoras = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString();
  const creadas = () =>
    (mockPrismaService.notificacion.createMany.mock.calls[0][0] as { data: Array<{ tipo: string; programada_para: Date; id_plan: string }> }).data;

  it('[RF10] encola cada recordatorio del plan a su hora exacta y con su id_plan', async () => {
    const horaCorte = enHoras(5);
    await service.handlePlanGenerado({
      id_usuario: 'usr-rf10',
      id_plan: 'plan-uuid-001',
      fecha: '2026-10-25',
      recordatorios: [{ tipo: 'corte_cafeina', programadaPara: horaCorte }],
    });

    expect(creadas()).toEqual([
      expect.objectContaining({ tipo: 'corte_cafeina', programada_para: new Date(horaCorte), id_plan: 'plan-uuid-001', estado: 'pendiente' }),
    ]);
  });

  it('[RF10] al regenerar cancela los pendientes del mismo plan y recrea en una sola transacción', async () => {
    await service.handlePlanGenerado({
      id_usuario: 'usr-rf10b',
      id_plan: 'plan-uuid-002',
      fecha: '2026-10-25',
      recordatorios: [
        { tipo: 'relajacion', programadaPara: enHoras(10) },
        { tipo: 'dormir', programadaPara: enHoras(10.5) },
      ],
    });

    expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.notificacion.updateMany).toHaveBeenCalledWith({
      where: { id_plan: 'plan-uuid-002', estado: 'pendiente' },
      data: { estado: 'cancelada' },
    });
    expect(creadas()).toHaveLength(2);
  });

  it('[RF10] si falla la creación, la transacción no deja el plan sin recordatorios', async () => {
    mockPrismaService.$transaction.mockRejectedValueOnce(new Error('bd caída'));
    await expect(
      service.handlePlanGenerado({
        id_usuario: 'usr-rf10c',
        id_plan: 'plan-uuid-004',
        fecha: '2026-10-25',
        recordatorios: [{ tipo: 'dormir', programadaPara: enHoras(3) }],
      }),
    ).rejects.toThrow('bd caída');
    // Cancelar y crear viajan juntos en la misma transacción, nunca por separado.
    expect(mockPrismaService.$transaction.mock.calls[0][0]).toHaveLength(2);
  });

  it('[RF10] no encola recordatorios cuya hora ya pasó', async () => {
    await service.handlePlanGenerado({
      id_usuario: 'usr-rf10d',
      id_plan: 'plan-uuid-005',
      fecha: '2026-10-25',
      recordatorios: [
        { tipo: 'luz', programadaPara: enHoras(-2) },
        { tipo: 'dormir', programadaPara: enHoras(4) },
      ],
    });

    expect(creadas().map((n) => n.tipo)).toEqual(['dormir']);
  });

  it('[RF10] un plan nocturno con protección de luz no genera notificación de tipo "luz"', async () => {
    // protegerLuz=true → derivarRecordatorios no incluye 'luz'
    await service.handlePlanGenerado({
      id_usuario: 'usr-nocturno',
      id_plan: 'plan-uuid-003',
      fecha: '2026-10-26',
      recordatorios: [
        { tipo: 'relajacion', programadaPara: enHoras(6) },
        { tipo: 'dormir', programadaPara: enHoras(6.5) },
      ],
    });

    expect(creadas().map((n) => n.tipo)).toEqual(['relajacion', 'dormir']);
  });

  it('la clave pública VAPID sale de la configuración y sin ella responde 503', async () => {
    await expect(service.obtenerClavePublica()).resolves.toEqual({ clavePublica: 'test-pub' });
    mockConfigService.get.mockReturnValueOnce(null);
    await expect(service.obtenerClavePublica()).rejects.toThrow(ServiceUnavailableException);
  });
});
