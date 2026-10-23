import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tarjeta',
  template: `<ng-content />`,
  host: { '[class.heroe]': 'heroe()' },
  styles: `
    :host {
      display: block;
      padding: 16px;
      background: var(--color-superficie);
      border: 1px solid var(--color-borde);
      border-radius: var(--radio-tarjeta);
      box-shadow: var(--sombra-tarjeta);
    }
    :host(.heroe) {
      padding: 18px;
      border-radius: 20px;
    }
  `,
})
export class TarjetaComponent {
  readonly heroe = input(false);
}
