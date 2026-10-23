import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ChipComponent } from './chip.component';

@Component({
  imports: [ChipComponent],
  template: `<app-chip [activo]="activo">Bostezos</app-chip>`,
})
class AnfitrionComponent {
  activo = false;
}

describe('ChipComponent', () => {
  function crear(activo: boolean) {
    const fixture = TestBed.createComponent(AnfitrionComponent);
    fixture.componentInstance.activo = activo;
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('app-chip') as HTMLElement;
  }

  it('proyecta el texto', () => {
    expect(crear(false).textContent).toContain('Bostezos');
  });

  it('expone el estado activo a lectores de pantalla', () => {
    expect(crear(true).getAttribute('aria-pressed')).toBe('true');
    expect(crear(false).getAttribute('aria-pressed')).toBe('false');
  });
});
