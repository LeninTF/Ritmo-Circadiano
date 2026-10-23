import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ConsentimientoComponent } from './consentimiento.component';
import { FlujoRegistroService } from './flujo-registro.service';
import { IngresarComponent } from './ingresar.component';
import { RegistroComponent } from './registro.component';
import { SesionService } from './sesion.service';
import { crearJwtPrueba } from './token-prueba';

const api = environment.apiUrl;

function preparar() {
  localStorage.clear();
  TestBed.configureTestingModule({
    providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
  });
  return {
    backend: TestBed.inject(HttpTestingController),
    router: TestBed.inject(Router),
  };
}

function obtener<T extends Element = HTMLElement>(raiz: HTMLElement, selector: string): T {
  const elemento = raiz.querySelector<T>(selector);
  if (!elemento) throw new Error(`No existe ${selector}`);
  return elemento;
}

function escribir(raiz: HTMLElement, selector: string, valor: string) {
  const campo = obtener<HTMLInputElement | HTMLSelectElement>(raiz, selector);
  campo.value = valor;
  campo.dispatchEvent(new Event(campo instanceof HTMLSelectElement ? 'change' : 'input'));
}

describe('ConsentimientoComponent', () => {
  it('el boton Continuar esta bloqueado hasta aceptar y luego va a /registro', async () => {
    const { router } = preparar();
    const navegar = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(ConsentimientoComponent);
    await fixture.whenStable();
    const raiz: HTMLElement = fixture.nativeElement;
    const boton = obtener<HTMLButtonElement>(raiz, 'button[type=submit]');
    expect(boton.disabled).toBe(true);

    const casilla = obtener<HTMLInputElement>(raiz, 'input[type=checkbox]');
    casilla.checked = true;
    casilla.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(boton.disabled).toBe(false);

    boton.click();
    expect(TestBed.inject(FlujoRegistroService).consentimientoAceptado()).toBe(true);
    expect(navegar).toHaveBeenCalledWith(['/registro']);
  });
});

describe('RegistroComponent', () => {
  const areas = [{ id: 'a-1', nombre: 'Operaciones – Conductores' }];

  it('carga las areas y envia el registro con consentimiento true', async () => {
    const { backend } = preparar();
    const fixture = TestBed.createComponent(RegistroComponent);
    fixture.detectChanges();
    backend.expectOne(`${api}/areas`).flush(areas);
    await fixture.whenStable();
    const raiz: HTMLElement = fixture.nativeElement;

    escribir(raiz, 'input[formControlName=correo]', 'ana@ejemplo.pe');
    escribir(raiz, 'input[formControlName=clave]', 'una-clave-larga');
    escribir(raiz, 'select[formControlName=idArea]', 'a-1');
    obtener(raiz, 'form').dispatchEvent(new Event('submit'));

    const peticion = backend.expectOne(`${api}/auth/registro`);
    expect(peticion.request.body).toEqual({
      correo: 'ana@ejemplo.pe',
      clave: 'una-clave-larga',
      idArea: 'a-1',
      consentimiento: true,
    });
    peticion.flush({ codigoParticipante: 'P07' });
    await fixture.whenStable();
    expect(raiz.querySelector('.codigo')?.textContent).toContain('P07');
  });

  it('no envia si la clave es corta y avisa', async () => {
    const { backend } = preparar();
    const fixture = TestBed.createComponent(RegistroComponent);
    fixture.detectChanges();
    backend.expectOne(`${api}/areas`).flush(areas);
    await fixture.whenStable();
    const raiz: HTMLElement = fixture.nativeElement;
    escribir(raiz, 'input[formControlName=correo]', 'ana@ejemplo.pe');
    escribir(raiz, 'input[formControlName=clave]', 'corta');
    escribir(raiz, 'select[formControlName=idArea]', 'a-1');
    obtener(raiz, 'form').dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    backend.expectNone(`${api}/auth/registro`);
    expect(raiz.querySelector('[role=alert]')).not.toBeNull();
  });

  it('muestra un mensaje claro si el correo ya existe', async () => {
    const { backend } = preparar();
    const fixture = TestBed.createComponent(RegistroComponent);
    fixture.detectChanges();
    backend.expectOne(`${api}/areas`).flush(areas);
    await fixture.whenStable();
    const raiz: HTMLElement = fixture.nativeElement;
    escribir(raiz, 'input[formControlName=correo]', 'ana@ejemplo.pe');
    escribir(raiz, 'input[formControlName=clave]', 'una-clave-larga');
    escribir(raiz, 'select[formControlName=idArea]', 'a-1');
    obtener(raiz, 'form').dispatchEvent(new Event('submit'));
    backend
      .expectOne(`${api}/auth/registro`)
      .flush({ code: 'correo_duplicado' }, { status: 409, statusText: 'Conflicto' });
    await fixture.whenStable();
    expect(raiz.querySelector('[role=alert]')?.textContent).toContain('Ya existe una cuenta');
  });
});

describe('IngresarComponent', () => {
  const tokens = {
    accessToken: crearJwtPrueba({ sub: 'u', rol: 'trabajador', codigoParticipante: 'P01' }),
    refreshToken: crearJwtPrueba({ sub: 'u' }),
    expiraEnSegundos: 60,
  };

  it('guarda la sesion y navega al plan', async () => {
    const { backend, router } = preparar();
    const ir = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const fixture = TestBed.createComponent(IngresarComponent);
    await fixture.whenStable();
    const raiz: HTMLElement = fixture.nativeElement;
    escribir(raiz, 'input[formControlName=correo]', 'ana@ejemplo.pe');
    escribir(raiz, 'input[formControlName=clave]', 'una-clave-larga');
    obtener(raiz, 'form').dispatchEvent(new Event('submit'));
    backend.expectOne(`${api}/auth/login`).flush(tokens);
    expect(TestBed.inject(SesionService).estaAutenticada()).toBe(true);
    expect(ir).toHaveBeenCalledWith('/plan');
  });

  it('credenciales incorrectas muestran un mensaje y no abren sesion', async () => {
    const { backend } = preparar();
    const fixture = TestBed.createComponent(IngresarComponent);
    await fixture.whenStable();
    const raiz: HTMLElement = fixture.nativeElement;
    escribir(raiz, 'input[formControlName=correo]', 'ana@ejemplo.pe');
    escribir(raiz, 'input[formControlName=clave]', 'mala');
    obtener(raiz, 'form').dispatchEvent(new Event('submit'));
    backend
      .expectOne(`${api}/auth/login`)
      .flush({ code: 'credenciales_invalidas' }, { status: 401, statusText: 'No autorizado' });
    await fixture.whenStable();
    expect(raiz.querySelector('[role=alert]')?.textContent).toContain('incorrectos');
    expect(TestBed.inject(SesionService).estaAutenticada()).toBe(false);
  });
});
