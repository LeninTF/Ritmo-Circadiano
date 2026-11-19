import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { IndicadoresService } from './indicadores.service';

describe('IndicadoresService (RF13)', () => {
  it('llama a la API configurada, no al origen de la PWA (staging)', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const http = TestBed.inject(HttpTestingController);
    TestBed.inject(IndicadoresService).obtenerPanel('2026-11-01', '2026-11-07').subscribe();
    const req = http.expectOne((r) => r.url === `${environment.apiUrl}/indicadores/panel`);
    expect(req.request.params.get('desde')).toBe('2026-11-01');
    req.flush({ suficiente: false });
    http.verify();
  });
});
