import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { SwPush } from '@angular/service-worker';
import { provideRouter, Router } from '@angular/router';
import { PushService } from './push.service';
import { Subject } from 'rxjs';

describe('PushService', () => {
  let service: PushService;
  let httpMock: HttpTestingController;
  let clickSubject: Subject<unknown>;
  const mockSwPush = {
    isEnabled: true,
    notificationClicks: new Subject<unknown>(),
    requestSubscription: jest.fn(),
  };

  beforeEach(() => {
    clickSubject = new Subject<unknown>();
    mockSwPush.notificationClicks = clickSubject;
    mockSwPush.requestSubscription.mockReset();

    TestBed.configureTestingModule({
      providers: [
        PushService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: SwPush, useValue: mockSwPush },
      ],
    });
    service = TestBed.inject(PushService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe solicitar suscripción VAPID y enviarla al servidor', async () => {
    const subFake = {
      toJSON: () => ({
        endpoint: 'https://push.example/sub',
        keys: { p256dh: 'key_p', auth: 'key_a' },
      }),
    };
    mockSwPush.requestSubscription.mockResolvedValue(subFake);

    const promesa = service.solicitarSuscripcion();
    // 1. Interceptar y responder la nueva petición GET de la clave pública
    const reqClave = httpMock.expectOne('http://localhost:3000/push/clave-publica');
    expect(reqClave.request.method).toBe('GET');
    reqClave.flush({ clavePublica: 'clave-falsa-servidor' });

    // Avanzar el ciclo de promesas
    await Promise.resolve();
    await Promise.resolve();

    // 2. Interceptar y validar el POST de la suscripción
    const req = httpMock.expectOne('http://localhost:3000/push/suscripciones');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      endpoint: 'https://push.example/sub',
      clave_p256dh: 'key_p',
      clave_auth: 'key_a',
    });
    req.flush(null);

    const resultado = await promesa;
    expect(resultado).toBe('suscrito');
    expect(mockSwPush.requestSubscription).toHaveBeenCalledWith({
      serverPublicKey: 'clave-falsa-servidor',
    });
  });

  it('si el servidor no entrega la clave VAPID no pide permiso ni suscribe', async () => {
    const promesa = service.solicitarSuscripcion();
    httpMock
      .expectOne('http://localhost:3000/push/clave-publica')
      .flush(null, { status: 503, statusText: 'Service Unavailable' });

    await expect(promesa).resolves.toBe('error');
    expect(mockSwPush.requestSubscription).not.toHaveBeenCalled();
    httpMock.expectNone('http://localhost:3000/push/suscripciones');
  });

  it('en iOS sin instalar devuelve la guía en vez de pedir permiso', async () => {
    const userAgent = jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)');
    try {
      await expect(service.solicitarSuscripcion()).resolves.toBe('ios-sin-instalar');
      expect(mockSwPush.requestSubscription).not.toHaveBeenCalled();
      httpMock.expectNone('http://localhost:3000/push/clave-publica');
    } finally {
      userAgent.mockRestore();
    }
  });

  it.each([
    ['corte_cafeina', '/cafeina'],
    ['dormir', '/plan'],
    [undefined, '/plan'],
  ])('al tocar un recordatorio %s marca abierta y abre %s', async (tipo, ruta) => {
    const navegar = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    clickSubject.next({ action: '', notification: { data: { id_notificacion: 7, tipo } } });

    httpMock.expectOne('http://localhost:3000/notificaciones/7/abierta').flush({});
    await Promise.resolve();
    await Promise.resolve();
    expect(navegar).toHaveBeenCalledWith([ruta]);
  });
});
