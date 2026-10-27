import { Component, ElementRef, afterNextRender, output, viewChild } from '@angular/core';

/** Hoja inferior que explica cómo instalar la PWA en iOS antes de pedir push (RNF06, CLAUDE.md §7). */
@Component({
  selector: 'app-guia-instalacion-ios',
  host: { '(document:keydown.escape)': 'cerrar.emit()' },
  template: `
    <div class="hoja" role="dialog" aria-modal="true" aria-labelledby="guia-ios-titulo">
      <h2 id="guia-ios-titulo">Instala la app para recibir recordatorios</h2>
      <ol>
        <li>Toca el botón <strong>Compartir</strong> de Safari.</li>
        <li>Elige <strong>Agregar a pantalla de inicio</strong>.</li>
        <li>Abre la app desde el icono nuevo y activa los recordatorios.</li>
      </ol>
      <p class="nota">Necesitas iOS 16.4 o superior.</p>
      <button #boton type="button" (click)="cerrar.emit()">Entendido</button>
    </div>
  `,
  styles: `
    :host {
      position: fixed;
      inset: auto 0 0 0;
      z-index: 10;
      display: flex;
      justify-content: center;
    }
    .hoja {
      width: 100%;
      max-width: 390px;
      display: grid;
      gap: 16px;
      padding: 20px 20px calc(20px + env(safe-area-inset-bottom));
      color: var(--color-texto);
      background: var(--color-superficie);
      border-radius: var(--radio-hoja) var(--radio-hoja) 0 0;
      box-shadow: var(--sombra-hoja);
    }
    h2 { margin: 0; font-size: 1.125rem; line-height: 1.5rem; font-weight: 600; }
    ol { margin: 0; padding-left: 20px; display: grid; gap: 8px; font-size: 1rem; line-height: 1.5rem; }
    .nota { margin: 0; font-size: 0.875rem; color: var(--color-texto-2); }
    button {
      min-height: var(--alto-boton-primario);
      font: inherit;
      font-size: 1.0625rem;
      font-weight: 600;
      color: var(--color-sobre-primario);
      background: var(--color-primario);
      border: 0;
      border-radius: var(--radio-boton);
      cursor: pointer;
    }
  `,
})
export class GuiaInstalacionIosComponent {
  readonly cerrar = output<void>();
  private readonly boton = viewChild.required<ElementRef<HTMLButtonElement>>('boton');

  constructor() {
    afterNextRender(() => this.boton().nativeElement.focus());
  }
}
