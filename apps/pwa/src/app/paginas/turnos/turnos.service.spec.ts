import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { OfflineStoreService } from '../../core/offline/offline-store.service';
import { TurnosService } from './turnos.service';

describe('TurnosService (RF04)', () => {
  let servicio: TurnosService;
  let http: HttpTestingController;
  const api = `${environment.apiUrl}/operaciones`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: OfflineStoreService, useValue: { addTurno: jest.fn(), getMyTurnos: jest.fn().mockResolvedValue([]) } },
      ],
    });
    servicio = TestBed.inject(TurnosService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('todas las llamadas usan environment.apiUrl (staging: la API no vive en el origen de la PWA)', () => {
    servicio.listarRutas().subscribe();
    servicio.crearTurno({} as never).subscribe();
    http.expectOne(`${api}/rutas`).flush([]);
    http.expectOne(`${api}/turnos`).flush({});
  });
});
