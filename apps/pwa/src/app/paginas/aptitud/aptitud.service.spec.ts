import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AptitudService } from './aptitud.service';
import type {
  CrearAptitudRequest,
  CrearAptitudResponse,
  ConsultarDespachoRequest,
  ConsultarDespachoResponse,
} from '@circadiano/contracts';

describe('AptitudService', () => {
  let service: AptitudService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AptitudService],
    });
    service = TestBed.inject(AptitudService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('crearAptitud', () => {
    it('POSTs to /aptitud/:turnoId with request body and returns response', (done) => {
      const turnoId = 'turno-123';
      const request: CrearAptitudRequest = { somnolencia: 3, compartido: true };
      const mockResponse: CrearAptitudResponse = { color: 'ambar', horasSueno24h: 6, motivos: ['sueno_intermedio'] };

      service.crearAptitud(turnoId, request).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`/aptitud/${turnoId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });

    it('sends somnolencia only when compartido is false', (done) => {
      const turnoId = 'turno-456';
      const request: CrearAptitudRequest = { somnolencia: 2, compartido: false };
      const mockResponse: CrearAptitudResponse = { color: 'verde', horasSueno24h: 8, motivos: ['sueno_suficiente'] };

      service.crearAptitud(turnoId, request).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`/aptitud/${turnoId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });
  });

  describe('consultarDespacho', () => {
    it('GETs /aptitud/despacho with codigo and fecha query params', (done) => {
      const request: ConsultarDespachoRequest = { codigo: 'T-789', fecha: '2025-01-15' };
      const mockResponse: ConsultarDespachoResponse = {
        evaluaciones: [
          { codigo: 'CON-001', color: 'verde' },
          { codigo: 'CON-002', color: 'rojo' },
        ],
      };

      service.consultarDespacho(request).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne((req) => req.url === '/aptitud/despacho' && req.params.get('codigo') === request.codigo && req.params.get('fecha') === request.fecha);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('codigo')).toBe(request.codigo);
      expect(req.request.params.get('fecha')).toBe(request.fecha);
      req.flush(mockResponse);
    });

    it('returns empty array on empty response', (done) => {
      const request: ConsultarDespachoRequest = { codigo: 'T-999', fecha: '2025-01-16' };

      service.consultarDespacho(request).subscribe((response) => {
        expect(response.evaluaciones).toEqual([]);
        done();
      });

      const req = httpMock.expectOne((req) => req.url === '/aptitud/despacho' && req.params.get('codigo') === request.codigo && req.params.get('fecha') === request.fecha);
      req.flush({ evaluaciones: [] });
    });
  });
});