import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import type { BebidaDto } from '@circadiano/contracts';
import { CafeinaComponent } from './cafeina.component';
import { CafeinaService } from './cafeina.service';

const BEBIDAS: BebidaDto[] = [
  { id_bebida: 1, nombre: 'Café pasado', cafeina_mg: 95, volumen_ml: 240 },
  { id_bebida: 2, nombre: 'Té verde', cafeina_mg: 30, volumen_ml: 240 },
];

describe('CafeinaComponent (HU-03)', () => {
  let fixture: ComponentFixture<CafeinaComponent>;
  let el: HTMLElement;
  const servicio = { obtenerBebidas: jest.fn(), registrar: jest.fn() };

  const tiles = () => Array.from(el.querySelectorAll<HTMLButtonElement>('button.tile'));
  const boton = (texto: string) =>
    Array.from(el.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent?.includes(texto));
  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    servicio.obtenerBebidas.mockResolvedValue(BEBIDAS);
    servicio.registrar.mockResolvedValue('cid-1');
    await TestBed.configureTestingModule({
      imports: [CafeinaComponent],
      providers: [provideRouter([]), { provide: CafeinaService, useValue: servicio }],
    }).compileComponents();
    fixture = TestBed.createComponent(CafeinaComponent);
    el = fixture.nativeElement;
    await render();
  });

  it('muestra el catálogo de la API más «Otro», sin selección ni botón Guardar', () => {
    expect(tiles().map((t) => t.querySelector('.nombre')?.textContent)).toEqual(['Café pasado', 'Té verde', 'Otro']);
    expect(tiles().every((t) => t.getAttribute('aria-pressed') === 'false')).toBe(true);
    expect(boton('Guardar')).toBeUndefined();
  });

  it('al elegir una bebida la marca y el total cambia en vivo con las porciones', async () => {
    tiles()[0].click();
    await render();
    expect(tiles()[0].getAttribute('aria-pressed')).toBe('true');
    expect(el.querySelector('.cifra-heroe')?.textContent).toBe('95');

    el.querySelector<HTMLButtonElement>('[aria-label="Agregar una porción"]')?.click();
    await render();
    expect(el.querySelector('.cifra-heroe')?.textContent).toBe('190');
  });

  it('«Otro» pide los mg, avisa el error al salir del campo y bloquea Guardar hasta que sean válidos', async () => {
    tiles()[2].click();
    await render();
    expect(el.querySelector('.error')?.textContent?.trim()).toBe('');
    expect(boton('Guardar')?.disabled).toBe(true);

    const mg = el.querySelector<HTMLInputElement>('#mg');
    if (!mg) throw new Error('falta el campo de mg');
    mg.dispatchEvent(new Event('blur'));
    await render();
    expect(el.querySelector('.error')?.textContent).toContain('Indica los mg (entre 1 y 1000).');

    mg.value = '150';
    mg.dispatchEvent(new Event('input'));
    await render();
    expect(boton('Guardar')?.disabled).toBe(false);
  });

  it('guardar registra lo elegido y vuelve a «Mi consumo» con el aviso', async () => {
    const navegar = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    tiles()[0].click();
    await render();
    boton('Guardar')?.click();
    await render();

    expect(servicio.registrar).toHaveBeenCalledWith(expect.objectContaining({ bebida: BEBIDAS[0], porciones: 1 }));
    expect(navegar).toHaveBeenCalledWith(['/cafeina'], {
      state: { aviso: expect.stringMatching(/Café registrado|Guardado en tu teléfono/) },
    });
    expect(el.querySelector('.aviso')?.textContent).toMatch(/Café registrado|Guardado en tu teléfono/);
    expect(boton('Guardar')).toBeUndefined();
  });

  it('si no se pudo encolar, muestra el error y conserva la selección', async () => {
    servicio.registrar.mockRejectedValue(new Error('Sin sesion'));
    tiles()[0].click();
    await render();
    boton('Guardar')?.click();
    await render();

    expect(el.querySelector('.error')?.textContent).toContain('No se pudo guardar. Intenta de nuevo.');
    expect(tiles()[0].getAttribute('aria-pressed')).toBe('true');
  });
});
