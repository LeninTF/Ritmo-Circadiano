import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { provideRouter } from '@angular/router';
import { autenticadoGuard, rolGuard } from './auth.guards';
import { consentimientoGuard, FlujoRegistroService } from './flujo-registro.service';
import { SesionService } from './sesion.service';
import { crearJwtPrueba } from './token-prueba';

const ruta = {} as ActivatedRouteSnapshot;
const estado = { url: '/indicadores' } as RouterStateSnapshot;

describe('guards de identidad', () => {
  let sesion: SesionService;
  let router: Router;
  const entrar = (rol: string) =>
    sesion.iniciar({
      accessToken: crearJwtPrueba({ sub: 'u', rol }),
      refreshToken: crearJwtPrueba({ sub: 'u' }),
      expiraEnSegundos: 60,
    });
  const ejecutar = (guard: typeof autenticadoGuard) =>
    TestBed.runInInjectionContext(() => guard(ruta, estado));

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    sesion = TestBed.inject(SesionService);
    router = TestBed.inject(Router);
  });

  it('sin sesion redirige a /ingresar recordando el destino', () => {
    const resultado = ejecutar(autenticadoGuard) as UrlTree;
    expect(router.serializeUrl(resultado)).toBe('/ingresar?retorno=%2Findicadores');
  });

  it('con sesion deja pasar', () => {
    entrar('trabajador');
    expect(ejecutar(autenticadoGuard)).toBe(true);
  });

  it('rolGuard deja pasar al rol permitido', () => {
    entrar('jefe_operaciones');
    expect(ejecutar(rolGuard('jefe_operaciones'))).toBe(true);
  });

  it('rolGuard manda a /plataforma si el rol no corresponde', () => {
    entrar('trabajador');
    const resultado = ejecutar(rolGuard('jefe_operaciones')) as UrlTree;
    expect(router.serializeUrl(resultado)).toBe('/plataforma');
  });

  it('rolGuard sin sesion manda a /ingresar', () => {
    const resultado = ejecutar(rolGuard('jefe_operaciones')) as UrlTree;
    expect(router.serializeUrl(resultado)).toContain('/ingresar');
  });

  it('consentimientoGuard exige haber aceptado', () => {
    const bloqueada = ejecutar(consentimientoGuard) as UrlTree;
    expect(router.serializeUrl(bloqueada)).toBe('/consentimiento');
    TestBed.inject(FlujoRegistroService).consentimientoAceptado.set(true);
    expect(ejecutar(consentimientoGuard)).toBe(true);
  });
});
