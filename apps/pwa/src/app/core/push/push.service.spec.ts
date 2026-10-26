import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { SwPush } from '@angular/service-worker';
import { provideRouter } from '@angular/router';
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
    await Promise.resolve();
    await Promise.resolve();

    const req = httpMock.expectOne('http://localhost:3000/push/suscripciones');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      endpoint: 'https://push.example/sub',
      clave_p256dh: 'key_p',
      clave_auth: 'key_a',
    });
    req.flush(null);

    const resultado = await promesa;
    expect(resultado).toBe(true);
    expect(mockSwPush.requestSubscription).toHaveBeenCalledWith({
      serverPublicKey: expect.any(String),
    });
  });
});
