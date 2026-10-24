import { TestBed } from '@angular/core/testing';
import { MicroTarjetaComponent } from './micro-tarjeta.component';

describe('MicroTarjetaComponent', () => {
  function crear(entradas: Record<string, string>) {
    const fixture = TestBed.createComponent(MicroTarjetaComponent);
    for (const [clave, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(clave, valor);
    }
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('muestra etiqueta, valor y nota', () => {
    const el = crear({ etiqueta: 'CAFÉ HASTA', valor: '16:30', nota: 'Corte de hoy' });
    expect(el.textContent).toContain('CAFÉ HASTA');
    expect(el.textContent).toContain('16:30');
    expect(el.textContent).toContain('Corte de hoy');
  });

  it('colorea el valor con el token indicado, sin hex', () => {
    const el = crear({ etiqueta: 'LUZ NATURAL', valor: '06:10', color: 'ok' });
    const valor = el.querySelector<HTMLElement>('.valor');
    expect(valor?.style.color).toBe('var(--color-ok)');
  });

  it('no pinta la nota si no se indica', () => {
    const el = crear({ etiqueta: 'PRÓX. PICO', valor: '17:00' });
    expect(el.querySelector('.nota')).toBeNull();
  });
});
