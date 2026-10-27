import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { PlanDiarioDto } from '@circadiano/contracts';
import { PlanService } from '../plan/plan.service';
import { CafeinaService, resumenLocal, type ConsumoItem, type MiConsumo } from './cafeina.service';
import { MiConsumoComponent } from './mi-consumo.component';

// 15:00 en Lima: 95 mg hace 10 h y 63 mg ahora → ~87 mg activos.
const AHORA = new Date('2026-10-24T20:00:00.000Z');
const ENVIADO: ConsumoItem = {
  clientId: 'a', idIngesta: 7, nombre: 'Café pasado', cafeinaMg: 95, fechaHora: '2026-10-24T15:00:00.000Z', pendiente: false,
};
const EN_COLA: ConsumoItem = {
  clientId: 'b', idIngesta: null, nombre: 'Expreso', cafeinaMg: 63, fechaHora: '2026-10-24T20:00:00.000Z', pendiente: true,
};
const conConsumo = (cambios: Partial<MiConsumo> = {}): MiConsumo => ({
  resumen: resumenLocal(
    [
      { clientId: 'a', cafeinaMg: 95, nombre: 'Café pasado', fechaHora: '2026-10-24T10:00:00.000Z' },
      { clientId: 'b', cafeinaMg: 63, nombre: 'Expreso', fechaHora: '2026-10-24T20:00:00.000Z' },
    ],
    AHORA,
  ),
  items: [EN_COLA, ENVIADO],
  sinSenal: false,
  ...cambios,
});

describe('MiConsumoComponent (HU-04, HU-05)', () => {
  let fixture: ComponentFixture<MiConsumoComponent>;
  let el: HTMLElement;
  const cafeina = { obtenerMiConsumo: jest.fn(), eliminar: jest.fn() };
  const planes = { obtenerPlanDelDia: jest.fn() };
  const texto = (selector: string) => el.querySelector(selector)?.textContent?.trim() ?? '';

  const montar = async () => {
    await TestBed.configureTestingModule({
      imports: [MiConsumoComponent],
      providers: [
        provideRouter([]),
        { provide: CafeinaService, useValue: cafeina },
        { provide: PlanService, useValue: planes },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MiConsumoComponent);
    el = fixture.nativeElement;
    await refrescar();
  };
  const refrescar = async () => {
    fixture.detectChanges();
    // cargar() corre fuera de whenStable: se deja terminar la cadena de promesas.
    await new Promise((r) => setTimeout(r, 0));
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(() => {
    jest.resetAllMocks();
    cafeina.obtenerMiConsumo.mockResolvedValue(conConsumo());
    cafeina.eliminar.mockResolvedValue(undefined);
    planes.obtenerPlanDelDia.mockResolvedValue(null);
  });

  it('muestra la cafeína activa como estimación, el total de hoy, 7 barras y el botón principal', async () => {
    await montar();

    expect(texto('.cifra-heroe')).toContain('~87');
    expect(texto('.estado')).toContain('Todavía activa');
    expect(texto('.mensaje')).toBe('Tienes ~87 mg de cafeína activa. Bajará a nivel bajo cerca de las 18:58.');
    expect(texto('.pie')).toBe('Estimación aproximada, no es un dato médico.');
    expect(texto('.alternativa')).toContain('Alternativa sin cafeína');
    expect(texto('.cifra')).toBe('158 mg · 2 registros');
    expect(el.querySelectorAll('.barras li')).toHaveLength(7);
    expect(el.querySelector('.barras li:last-child')?.getAttribute('aria-label')).toBe('Hoy: 158 mg');
    expect(el.querySelector('a.primario')?.getAttribute('href')).toBe('/cafeina/nuevo');
  });

  it('con plan usa su hora de dormir y su corte', async () => {
    planes.obtenerPlanDelDia.mockResolvedValue({
      plan: { inicioSueno: '2026-10-25T01:00:00.000Z', horaCorteCafeina: '2026-10-24T19:00:00.000Z' } as PlanDiarioDto,
    });
    await montar();
    expect(texto('.mensaje')).toBe(
      'Te quedan ~87 mg de cafeína activa. Si duermes a las 20:00, evita más café después de las 14:00.',
    );
  });

  it('lista los registros de hoy; los que están en la cola no se pueden eliminar', async () => {
    await montar();
    const filas = Array.from(el.querySelectorAll('.fila'));

    expect(filas.map((f) => f.querySelector('.nombre')?.textContent)).toEqual(['Expreso', 'Café pasado']);
    expect(filas[0].textContent).toContain('Pendiente de enviar');
    expect(filas[0].querySelector('button.eliminar')).toBeNull();
    expect(filas[1].querySelector('button.eliminar')?.getAttribute('aria-label')).toBe('Eliminar Café pasado de las 10:00');
  });

  it('eliminar pide confirmación en la misma fila, mueve el foco, borra y recarga', async () => {
    await montar();
    el.querySelector<HTMLButtonElement>('button.eliminar')?.click();
    await refrescar();

    expect(cafeina.eliminar).not.toHaveBeenCalled();
    const si = el.querySelector<HTMLButtonElement>('.confirmar .si');
    expect(el.querySelector('.confirmar')?.textContent).toContain('¿Eliminar este registro?');
    expect(document.activeElement).toBe(si);

    si?.click();
    await refrescar();
    expect(cafeina.eliminar).toHaveBeenCalledWith(ENVIADO);
    expect(cafeina.obtenerMiConsumo).toHaveBeenCalledTimes(2);
    expect(texto('.aviso')).toBe('Registro eliminado.');
  });

  it('«Cancelar» o Escape cierran la confirmación sin borrar', async () => {
    await montar();
    el.querySelector<HTMLButtonElement>('button.eliminar')?.click();
    await refrescar();
    el.querySelector<HTMLButtonElement>('.confirmar .no')?.click();
    await refrescar();
    expect(el.querySelector('.confirmar')).toBeNull();

    el.querySelector<HTMLButtonElement>('button.eliminar')?.click();
    await refrescar();
    el.querySelector('.confirmar')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await refrescar();
    expect(el.querySelector('.confirmar')).toBeNull();
    expect(cafeina.eliminar).not.toHaveBeenCalled();
  });

  it('estado vacío y aviso sin señal', async () => {
    cafeina.obtenerMiConsumo.mockResolvedValue({ resumen: resumenLocal([], AHORA), items: [], sinSenal: true });
    await montar();

    expect(texto('.vacio')).toBe('Aún no registras consumos. Empieza con tu primer café.');
    expect(texto('.nota')).toBe('Sin señal: calculado con lo registrado en este teléfono.');
    expect(texto('.estado')).toContain('Nivel bajo');
    expect(texto('.mensaje')).toBe('Tu cafeína activa está en nivel bajo.');
    expect(el.querySelector('.alternativa')).toBeNull();
  });

  it('si falla la carga ofrece reintentar', async () => {
    cafeina.obtenerMiConsumo.mockRejectedValueOnce(new Error('500'));
    await montar();
    expect(texto('.error')).toContain('Algo salió mal');

    el.querySelector<HTMLButtonElement>('button.secundario')?.click();
    await refrescar();
    expect(texto('.cifra')).toBe('158 mg · 2 registros');
  });

  it('si el plan falla, la tarjeta sigue con la hora de bajada', async () => {
    planes.obtenerPlanDelDia.mockRejectedValue(new Error('sin turno'));
    await montar();
    expect(texto('.mensaje')).toContain('Bajará a nivel bajo cerca de las 18:58.');
  });
});
