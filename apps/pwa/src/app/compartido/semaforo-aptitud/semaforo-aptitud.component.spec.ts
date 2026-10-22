import { ColorSemaforo } from '@circadiano/contracts';
import { TestBed } from '@angular/core/testing';
import { SemaforoAptitudComponent } from './semaforo-aptitud.component';

describe('SemaforoAptitudComponent', () => {
  function crear(color: ColorSemaforo) {
    const fixture = TestBed.createComponent(SemaforoAptitudComponent);
    fixture.componentRef.setInput('color', color);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it.each([
    ['verde', 'APTO', 'var(--color-ok)'],
    ['ambar', 'APTO CON MEDIDAS', 'var(--color-alerta)'],
    ['rojo', 'NO APTO', 'var(--color-peligro)'],
  ] as const)('%s muestra texto, icono y token de color', (color, texto, token) => {
    const el = crear(color);
    expect(el.querySelector('.texto')?.textContent?.trim()).toBe(texto);
    expect(el.querySelector('.icono')?.textContent?.trim()).toBeTruthy();
    expect(el.querySelector<HTMLElement>('.icono')?.style.background).toBe(token);
  });

  it('anuncia el estado a lectores de pantalla', () => {
    expect(crear('rojo').querySelector('[role="status"]')).not.toBeNull();
  });
});
