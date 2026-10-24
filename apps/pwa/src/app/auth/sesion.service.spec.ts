import { TestBed } from '@angular/core/testing';
import { decodificarJwt, SesionService } from './sesion.service';
import { crearJwtPrueba } from './token-prueba';

describe('SesionService', () => {
  const tokens = () => ({
    accessToken: crearJwtPrueba({ sub: 'u-1', rol: 'trabajador', codigoParticipante: 'P01' }),
    refreshToken: crearJwtPrueba({ sub: 'u-1', tipo: 'refresco' }),
    expiraEnSegundos: 3600,
  });

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('sin tokens no hay sesion', () => {
    const sesion = TestBed.inject(SesionService);
    expect(sesion.estaAutenticada()).toBe(false);
    expect(sesion.rol()).toBeNull();
  });

  it('iniciar expone rol y codigo, y recupera la sesion tras recargar', () => {
    TestBed.inject(SesionService).iniciar(tokens());
    TestBed.resetTestingModule();
    const recargada = TestBed.inject(SesionService);
    expect(recargada.estaAutenticada()).toBe(true);
    expect(recargada.rol()).toBe('trabajador');
    expect(recargada.codigoParticipante()).toBe('P01');
  });

  it('con el refresco vencido ya no hay sesion', () => {
    const sesion = TestBed.inject(SesionService);
    sesion.iniciar({ ...tokens(), refreshToken: crearJwtPrueba({ sub: 'u-1' }, -10) });
    expect(sesion.estaAutenticada()).toBe(false);
  });

  it('cerrar borra los tokens del almacenamiento', () => {
    const sesion = TestBed.inject(SesionService);
    sesion.iniciar(tokens());
    sesion.cerrar();
    expect(sesion.accessToken()).toBeNull();
    expect(localStorage.length).toBe(0);
  });

  it('un almacenamiento corrupto se ignora', () => {
    localStorage.setItem('gestor-circadiano-sesion', '{no es json');
    expect(TestBed.inject(SesionService).estaAutenticada()).toBe(false);
  });

  it('decodificarJwt devuelve null con un token mal formado', () => {
    expect(decodificarJwt('abc')).toBeNull();
    expect(decodificarJwt('a.%%%.c')).toBeNull();
  });
});
