import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GuiaInstalacionIosComponent } from './guia-instalacion-ios.component';

@Component({
  imports: [GuiaInstalacionIosComponent],
  template: `<app-guia-instalacion-ios (cerrar)="cerrados = cerrados + 1" />`,
})
class AnfitrionComponent {
  cerrados = 0;
}

describe('GuiaInstalacionIosComponent', () => {
  function crear() {
    const fixture = TestBed.createComponent(AnfitrionComponent);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('es un diálogo accesible con los 3 pasos de instalación', () => {
    const { el } = crear();
    const dialogo = el.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialogo.getAttribute('aria-modal')).toBe('true');
    expect(el.querySelector(`#${dialogo.getAttribute('aria-labelledby')}`)?.textContent).toContain('Instala la app');
    expect(el.querySelectorAll('li')).toHaveLength(3);
    expect(el.textContent).toContain('Agregar a pantalla de inicio');
  });

  it('se cierra con el botón y con Escape', () => {
    const { fixture, el } = crear();
    (el.querySelector('button') as HTMLButtonElement).click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(fixture.componentInstance.cerrados).toBe(2);
  });
});
