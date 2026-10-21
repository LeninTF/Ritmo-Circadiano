import { Component } from '@angular/core';

@Component({
  selector: 'app-aptitud',
  template: `
    <h1>Chequeo pre-salida</h1>
    <p class="aviso">
      Herramienta preventiva de apoyo. No reemplaza la evaluación médica ni
      autoriza la salida.
    </p>
  `,
  styles: `
    .aviso {
      color: var(--color-texto-2);
      font-size: 0.75rem;
    }
  `,
})
export class AptitudComponent {}
