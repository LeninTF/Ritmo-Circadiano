import { ColorSemaforo } from '@circadiano/contracts';
import { Component, computed, input } from '@angular/core';

// Mapa en vez de switch: un color nuevo es una fila nueva (OCP).
const ESTADOS: Record<ColorSemaforo, { texto: string; icono: string; token: string }> = {
  verde: { texto: 'APTO', icono: '✓', token: 'ok' },
  ambar: { texto: 'APTO CON MEDIDAS', icono: '!', token: 'alerta' },
  rojo: { texto: 'NO APTO', icono: '✕', token: 'peligro' },
};

@Component({
  selector: 'app-semaforo-aptitud',
  template: `
    <div class="estado" role="status">
      <span class="icono" aria-hidden="true" [style.background]="fondo()">{{ estado().icono }}</span>
      <span class="texto">{{ estado().texto }}</span>
    </div>
  `,
  styles: `
    .estado {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .icono {
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      font-weight: 700;
      color: var(--color-superficie);
    }
    .texto {
      font-size: 0.9375rem;
      font-weight: 700;
      color: var(--color-texto);
    }
  `,
})
export class SemaforoAptitudComponent {
  readonly color = input.required<ColorSemaforo>();
  protected readonly estado = computed(() => ESTADOS[this.color()]);
  protected readonly fondo = computed(() => `var(--color-${this.estado().token})`);
}
