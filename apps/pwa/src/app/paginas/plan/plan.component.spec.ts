import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { GuiaInstalacionIosComponent } from '../../compartido/guia-instalacion-ios/guia-instalacion-ios.component';
import { PushService, type ResultadoSuscripcion } from '../../core/push/push.service';
import { PlanComponent } from './plan.component';

describe('PlanComponent · activar recordatorios (RF10, RNF06)', () => {
  const push = { suscrito: signal(false), solicitarSuscripcion: jest.fn<Promise<ResultadoSuscripcion>, []>() };

  async function pulsar(resultado: ResultadoSuscripcion) {
    push.solicitarSuscripcion.mockResolvedValue(resultado);
    TestBed.configureTestingModule({
      imports: [PlanComponent],
      providers: [
        { provide: PushService, useValue: push },
        { provide: ActivatedRoute, useValue: { queryParamMap: of(convertToParamMap({})), paramMap: of(convertToParamMap({})) } },
      ],
    });
    // Las tarjetas de turno y plan tienen sus propios specs: aquí solo interesa el botón de push.
    TestBed.overrideComponent(PlanComponent, { set: { imports: [GuiaInstalacionIosComponent], schemas: [CUSTOM_ELEMENTS_SCHEMA] } });
    const fixture = TestBed.createComponent(PlanComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    (el.querySelector('.boton-push') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();
    return el;
  }

  beforeEach(() => push.suscrito.set(false));

  it('en iOS sin instalar muestra la guía y no un aviso de error', async () => {
    const el = await pulsar('ios-sin-instalar');
    expect(el.querySelector('app-guia-instalacion-ios')).not.toBeNull();
    expect(el.querySelector('.aviso-push')).toBeNull();
  });

  it('si falla avisa al trabajador con un mensaje accesible', async () => {
    const el = await pulsar('error');
    expect(el.querySelector('.aviso-push')?.getAttribute('role')).toBe('status');
    expect(el.querySelector('.aviso-push')?.textContent).toContain('No se pudieron activar');
    expect(el.querySelector('app-guia-instalacion-ios')).toBeNull();
  });

  it('suscrito: sin aviso ni guía', async () => {
    const el = await pulsar('suscrito');
    expect(el.querySelector('.aviso-push')).toBeNull();
    expect(el.querySelector('app-guia-instalacion-ios')).toBeNull();
  });
});
