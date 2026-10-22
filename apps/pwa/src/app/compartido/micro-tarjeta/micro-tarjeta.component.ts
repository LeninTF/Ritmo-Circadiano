import { Component, input } from '@angular/core';

@Component({
  selector: 'app-micro-tarjeta',
  template: `
    <span class="etiqueta">{{ etiqueta() }}</span>
    <span class="valor" [style.color]="'var(--color-' + color() + ')'">{{ valor() }}</span>
    @if (nota()) {
      <span class="nota">{{ nota() }}</span>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 12px;
      background: var(--color-superficie);
      border-radius: var(--radio-tile);
    }
    .etiqueta {
      font-size: 0.5625rem;
      font-weight: 600;
      letter-spacing: 0.4px;
      color: var(--color-texto-3);
    }
    .valor {
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.35;
    }
    .nota {
      font-size: 0.625rem;
      color: var(--color-texto-2);
    }
  `,
})
export class MicroTarjetaComponent {
  readonly etiqueta = input.required<string>();
  readonly valor = input.required<string>();
  readonly nota = input('');
  readonly color = input<'primario' | 'ok' | 'alerta'>('primario');
}
