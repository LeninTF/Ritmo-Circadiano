import { Component, input } from '@angular/core';

@Component({
  selector: 'app-chip',
  template: `<ng-content />`,
  host: { '[attr.aria-pressed]': 'activo()' },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      padding: 10px 12px;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--color-texto);
      background: var(--color-superficie);
      border: 1px solid var(--color-borde);
      border-radius: var(--radio-chip);
    }
    :host([aria-pressed='true']) {
      background: var(--color-alerta-fondo);
      border-color: var(--color-alerta);
    }
  `,
})
export class ChipComponent {
  readonly activo = input(false);
}
