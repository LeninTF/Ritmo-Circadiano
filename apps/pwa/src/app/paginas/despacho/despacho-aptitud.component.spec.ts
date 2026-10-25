import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { fechaLocal } from '../aptitud/aptitud.service';
import { DespachoAptitudComponent } from './despacho-aptitud.component';

const URL_DESPACHO = `${environment.apiUrl}/aptitud/despacho`;

describe('DespachoAptitudComponent (RF12, RN10)', () => {
  let fixture: ComponentFixture<DespachoAptitudComponent>;
  let http: HttpTestingController;

  const pagina = () => fixture.nativeElement as HTMLElement;
  const consulta = (): TestRequest => http.expectOne((r) => r.method === 'GET' && r.url === URL_DESPACHO);
  const estabilizar = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DespachoAptitudComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DespachoAptitudComponent);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('al abrir carga la lista del día local sin código', async () => {
    const req = consulta();
    expect(req.request.params.get('fecha')).toBe(fechaLocal(new Date()));
    expect(req.request.params.has('codigo')).toBe(false);
    req.flush({ evaluaciones: [] });
    await estabilizar();

    expect(pagina().querySelector<HTMLInputElement>('#fecha')?.value).toBe(fechaLocal(new Date()));
    expect(pagina().textContent).toContain('Nadie ha compartido su resultado');
  });

  it('dos turnos del mismo código se muestran sin error de track', async () => {
    const avisos = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    consulta().flush({
      evaluaciones: [
        { codigo: 'P01', color: 'verde' },
        { codigo: 'P01', color: 'rojo' },
        { codigo: 'P02', color: 'ambar' },
      ],
    });
    await estabilizar();

    const filas = [...pagina().querySelectorAll('li')].map((li) => [
      li.querySelector('.participante')?.textContent,
      li.querySelector('app-semaforo-aptitud .texto')?.textContent,
    ]);
    expect(filas).toEqual([
      ['P01', 'APTO'],
      ['P01', 'NO APTO'],
      ['P02', 'APTO CON MEDIDAS'],
    ]);
    expect(avisos).not.toHaveBeenCalled();
    avisos.mockRestore();
  });

  it('el filtro opcional envía el código normalizado', async () => {
    consulta().flush({ evaluaciones: [] });
    await estabilizar();

    const codigo = pagina().querySelector<HTMLInputElement>('#codigo') as HTMLInputElement;
    codigo.value = ' p01 ';
    codigo.dispatchEvent(new Event('input'));
    pagina().querySelector('form')?.dispatchEvent(new Event('submit'));

    const req = consulta();
    expect(req.request.params.get('codigo')).toBe('P01');
    req.flush({ evaluaciones: [{ codigo: 'P01', color: 'verde' }] });
    await estabilizar();
    expect(pagina().querySelectorAll('li')).toHaveLength(1);
  });

  it('403 → mensaje del rol', async () => {
    consulta().flush(null, { status: 403, statusText: 'Forbidden' });
    await estabilizar();
    expect(pagina().textContent).toContain('Esta vista es solo para el despachador.');
  });
});
