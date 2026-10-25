import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { PREGUNTAS_RMEQ, RmeqComponent } from './rmeq.component';

describe('RmeqComponent (RF03)', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RmeqComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('cada pregunta suma dentro del rango del rMEQ (mínimo 4, máximo 25)', () => {
    const extremos = (f: (v: number[]) => number) =>
      PREGUNTAS_RMEQ.reduce((total, p) => total + f(p.opciones.map((o) => o.valor)), 0);
    expect(extremos((v) => Math.min(...v))).toBe(4);
    expect(extremos((v) => Math.max(...v))).toBe(25);
  });

  it('no envía hasta responder las 5 preguntas y luego envía las respuestas', async () => {
    const fixture = TestBed.createComponent(RmeqComponent);
    const componente = fixture.componentInstance;
    fixture.detectChanges();
    const boton: HTMLButtonElement = fixture.nativeElement.querySelector('button[type=submit]');
    expect(boton.disabled).toBe(true);

    PREGUNTAS_RMEQ.forEach((p) => componente.responder(p.clave, p.opciones[0].valor));
    fixture.detectChanges();
    expect(boton.disabled).toBe(false);

    const envio = componente.enviar();
    const req = http.expectOne(`${environment.apiUrl}/cronotipo`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ p1: 5, p2: 1, p3: 5, p4: 5, p5: 6 });
    req.flush({ puntaje: 22, categoria: 'matutino_definido', actualizadoEn: '2026-10-24T00:00:00Z' });
    await envio;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Claramente de mañana');
  });
});
