import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TarjetaComponent } from './tarjeta.component';

@Component({
  imports: [TarjetaComponent],
  template: `<app-tarjeta [heroe]="heroe"><p>Contenido</p></app-tarjeta>`,
})
class AnfitrionComponent {
  heroe = false;
}

describe('TarjetaComponent', () => {
  function crear(heroe: boolean) {
    const fixture = TestBed.createComponent(AnfitrionComponent);
    fixture.componentInstance.heroe = heroe;
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('app-tarjeta') as HTMLElement;
  }

  it('proyecta su contenido', () => {
    expect(crear(false).textContent).toContain('Contenido');
  });

  it('marca la variante heroe con una clase', () => {
    expect(crear(true).classList.contains('heroe')).toBe(true);
    expect(crear(false).classList.contains('heroe')).toBe(false);
  });
});
