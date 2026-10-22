import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { authInterceptor } from './auth.interceptor';
import { SesionService } from './sesion.service';
import { crearJwtPrueba } from './token-prueba';

describe('authInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let sesion: SesionService;
  const router = { navigate: jest.fn() };
  const api = environment.apiUrl;
  const nuevo = (etiqueta: string) => ({
    accessToken: crearJwtPrueba({ sub: etiqueta, rol: 'trabajador' }),
    refreshToken: crearJwtPrueba({ sub: etiqueta, tipo: 'refresco' }),
    expiraEnSegundos: 3600,
  });

  beforeEach(() => {
    localStorage.clear();
    router.navigate.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    sesion = TestBed.inject(SesionService);
    sesion.iniciar(nuevo('a'));
  });

  afterEach(() => backend.verify());

  it('agrega el Bearer a la API propia (relativa o con apiUrl)', () => {
    http.get('/operaciones/rutas').subscribe();
    http.get(`${api}/me`).subscribe();
    for (const req of backend.match(() => true)) {
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${sesion.accessToken()}`);
      req.flush({});
    }
  });

  it('nunca manda el token a un tercero', () => {
    http.get('https://otro-sitio.example/datos').subscribe();
    const req = backend.expectOne('https://otro-sitio.example/datos');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('no manda el token a las rutas publicas', () => {
    http.post(`${api}/auth/login`, {}).subscribe();
    const req = backend.expectOne(`${api}/auth/login`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('ante un 401 renueva una sola vez y reintenta con el token nuevo', () => {
    const nuevos = nuevo('b');
    const respuestas: unknown[] = [];
    http.get('/uno').subscribe((r) => respuestas.push(r));
    http.get('/dos').subscribe((r) => respuestas.push(r));
    backend.expectOne('/uno').flush({}, { status: 401, statusText: 'No autorizado' });
    backend.expectOne('/dos').flush({}, { status: 401, statusText: 'No autorizado' });

    backend.expectOne(`${api}/auth/refresh`).flush(nuevos);

    for (const url of ['/uno', '/dos']) {
      const reintento = backend.expectOne(url);
      expect(reintento.request.headers.get('Authorization')).toBe(`Bearer ${nuevos.accessToken}`);
      reintento.flush({ ok: url });
    }
    expect(respuestas).toHaveLength(2);
  });

  it('si la renovacion falla con 401 cierra la sesion y va a /ingresar', () => {
    let error: unknown;
    http.get('/uno').subscribe({ error: (e) => (error = e) });
    backend.expectOne('/uno').flush({}, { status: 401, statusText: 'No autorizado' });
    backend.expectOne(`${api}/auth/refresh`).flush({}, { status: 401, statusText: 'No autorizado' });
    expect(error).toBeDefined();
    expect(sesion.estaAutenticada()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/ingresar']);
  });

  it('sin conexion durante la renovacion conserva la sesion', () => {
    http.get('/uno').subscribe({ error: () => undefined });
    backend.expectOne('/uno').flush({}, { status: 401, statusText: 'No autorizado' });
    backend.expectOne(`${api}/auth/refresh`).error(new ProgressEvent('error'), { status: 0 });
    expect(sesion.estaAutenticada()).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
