import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import type { BebidaDto } from '@circadiano/contracts';
import { CafeinaService, errorRegistro, totalMg, type RegistroCafeina } from './cafeina.service';

type Icono = 'cafe' | 'te' | 'energia' | 'gaseosa';
/** Icono por nombre de bebida; las bebidas nuevas caen en «cafe». */
const ICONOS: readonly [RegExp, Icono][] = [
  [/\bt[eé]\b|infusi/i, 'te'],
  [/energ/i, 'energia'],
  [/cola|gaseosa/i, 'gaseosa'],
];
const PORCIONES_MAX = 4;

const horaActual = (ahora = new Date()) =>
  `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;

/** RF08 · HU-03: registrar lo que tomé en pocos toques, también sin señal. */
@Component({
  selector: 'app-cafeina',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="pagina" aria-labelledby="titulo-cafeina">
      <header>
        <h1 id="titulo-cafeina">Registrar café</h1>
        <p class="texto-2">Elige lo que tomaste.</p>
      </header>

      @if (cargando()) {
        <p role="status" class="texto-2">Cargando bebidas…</p>
      } @else {
        <fieldset>
          <legend class="micro">Bebida</legend>
          @if (bebidas().length === 0) {
            <p class="texto-2">No pudimos cargar las bebidas. Puedes indicar los mg con «Otro».</p>
          }
          <div class="rejilla">
            @for (bebida of bebidas(); track bebida.id_bebida) {
              <button type="button" class="tile" [attr.aria-pressed]="seleccion() === bebida" (click)="elegir(bebida)">
                <span class="icono" aria-hidden="true">
                  <ng-container *ngTemplateOutlet="svg; context: { $implicit: icono(bebida) }" />
                </span>
                <span class="nombre">{{ bebida.nombre }}</span>
                <span class="detalle">{{ bebida.cafeina_mg }} mg · {{ bebida.volumen_ml }} ml</span>
                @if (seleccion() === bebida) {
                  <span class="check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></span>
                }
              </button>
            }
            <button type="button" class="tile" [attr.aria-pressed]="seleccion() === 'otro'" (click)="elegir('otro')">
              <span class="icono" aria-hidden="true">
                <ng-container *ngTemplateOutlet="svg; context: { $implicit: 'cafe' }" />
              </span>
              <span class="nombre">Otro</span>
              <span class="detalle">Indico los mg</span>
              @if (seleccion() === 'otro') {
                <span class="check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></span>
              }
            </button>
          </div>
        </fieldset>

        @if (seleccion(); as elegida) {
          @if (elegida === 'otro') {
            <div class="campo">
              <label for="mg">Miligramos de cafeína</label>
              <input id="mg" type="number" inputmode="numeric" min="1" max="1000" [value]="cafeinaMg() ?? ''"
                (input)="cambiarMg($any($event.target).value)" (blur)="mgTocado.set(true)"
                [attr.aria-invalid]="!!errorVisible()"
                aria-describedby="error-registro" />
            </div>
          } @else {
            <div class="campo">
              <span class="etiqueta" id="etiqueta-porciones">Porciones</span>
              <div class="stepper" role="group" aria-labelledby="etiqueta-porciones">
                <button type="button" class="paso" (click)="cambiarPorciones(-1)" [disabled]="porciones() === 1"
                  aria-label="Quitar una porción">−</button>
                <span class="cifra" aria-live="polite">{{ porciones() }}</span>
                <button type="button" class="paso" (click)="cambiarPorciones(1)" [disabled]="porciones() === porcionesMax"
                  aria-label="Agregar una porción">+</button>
              </div>
            </div>
          }

          <div class="campo">
            <label for="hora">Hora</label>
            <input id="hora" type="time" [value]="hora()" (input)="hora.set($any($event.target).value)"
              aria-describedby="error-registro" />
          </div>

          <p class="total"><span class="cifra-heroe">{{ total() }}</span> mg</p>
          <p id="error-registro" class="error" role="alert">{{ errorVisible() ?? errorGuardado() }}</p>

          <button type="button" class="primario" (click)="guardar()" [disabled]="guardando() || !!error()">
            {{ guardando() ? 'Guardando…' : 'Guardar' }}
          </button>
        }
        <p class="aviso" role="status">{{ aviso() }}</p>
      }
    </main>

    <ng-template #svg let-icono>
      @switch (icono) {
        @case ('te') {
          <svg viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
        }
        @case ('energia') {
          <svg viewBox="0 0 24 24"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
        }
        @case ('gaseosa') {
          <svg viewBox="0 0 24 24"><path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/><path d="m12 8 1-6h2"/></svg>
        }
        @default {
          <svg viewBox="0 0 24 24"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/></svg>
        }
      }
    </ng-template>
  `,
  imports: [NgTemplateOutlet],
  styles: `
    .pagina { max-width: 480px; margin: 0 auto; padding: 24px 20px 32px; display: grid; gap: 16px; }
    h1 { margin: 0; font-size: 1.5rem; line-height: 2rem; font-weight: 700; }
    .texto-2 { margin: 4px 0 0; color: var(--color-texto-2); }
    fieldset { border: 0; margin: 0; padding: 0; display: grid; gap: 12px; }
    .micro, .etiqueta, label {
      font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;
      color: var(--color-texto-2); padding: 0;
    }
    .rejilla { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .tile {
      position: relative; display: grid; gap: 8px; justify-items: start; min-height: 104px; padding: 16px;
      text-align: left; font: inherit; color: var(--color-texto); cursor: pointer;
      background: var(--color-superficie); border: 1px solid var(--color-borde); border-radius: var(--radio-tile);
      transition: border-color 150ms ease-out, transform 100ms ease-out;
    }
    .tile:active { transform: scale(0.98); }
    .tile[aria-pressed='true'] { border: 2px solid var(--color-primario); padding: 15px; }
    .icono {
      display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%;
      background: var(--color-primario-fondo); color: var(--color-primario);
    }
    svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .nombre { font-size: 1rem; font-weight: 600; line-height: 1.375rem; overflow-wrap: anywhere; }
    .detalle { font-size: 0.875rem; color: var(--color-texto-2); }
    .check {
      position: absolute; top: 12px; right: 12px; display: grid; place-items: center; width: 24px; height: 24px;
      border-radius: 50%; background: var(--color-primario); color: var(--color-sobre-primario);
    }
    .check svg { width: 16px; height: 16px; stroke-width: 3; }
    .campo { display: grid; gap: 8px; }
    input {
      min-height: var(--alto-tactil); padding: 0 16px; font: inherit; font-size: 1rem; color: var(--color-texto);
      background: var(--color-superficie); border: 1px solid var(--color-borde); border-radius: var(--radio-boton);
    }
    input[aria-invalid='true'] { border-color: var(--color-peligro); }
    .stepper { display: flex; align-items: center; gap: 16px; }
    .paso {
      width: var(--alto-tactil); height: var(--alto-tactil); font-size: 1.5rem; line-height: 1; cursor: pointer;
      color: var(--color-texto); background: var(--color-superficie-2); border: 0; border-radius: 50%;
    }
    .paso:disabled { opacity: 0.4; cursor: not-allowed; }
    .cifra { min-width: 2ch; text-align: center; font-size: 1.375rem; font-weight: 700; font-variant-numeric: tabular-nums; }
    .total { margin: 0; text-align: center; font-size: 1.125rem; font-weight: 600; color: var(--color-texto-2); }
    .cifra-heroe { font-size: 2.5rem; line-height: 2.875rem; font-weight: 700; color: var(--color-texto); font-variant-numeric: tabular-nums; }
    .error { margin: 0; min-height: 1.5rem; color: var(--color-peligro-texto); font-weight: 500; }
    .error:empty { display: none; }
    .primario {
      width: 100%; min-height: var(--alto-boton-primario); font: inherit; font-size: 1.0625rem; font-weight: 600;
      cursor: pointer; color: var(--color-sobre-primario); background: var(--color-primario);
      border: 0; border-radius: var(--radio-boton);
    }
    .primario:disabled { opacity: 0.5; cursor: not-allowed; }
    .aviso { margin: 0; text-align: center; color: var(--color-ok-texto); font-weight: 500; }
    .aviso:empty { display: none; }
  `,
})
export class CafeinaComponent implements OnInit {
  private readonly cafeina = inject(CafeinaService);

  readonly porcionesMax = PORCIONES_MAX;
  readonly bebidas = signal<BebidaDto[]>([]);
  readonly cargando = signal(true);
  readonly seleccion = signal<BebidaDto | 'otro' | null>(null);
  readonly porciones = signal(1);
  readonly cafeinaMg = signal<number | null>(null);
  readonly hora = signal(horaActual());
  readonly guardando = signal(false);
  readonly aviso = signal('');
  readonly errorGuardado = signal('');
  /** El error de mg se muestra al salir del campo, no apenas se elige «Otro». */
  readonly mgTocado = signal(false);

  private readonly registro = computed<RegistroCafeina>(() => {
    const elegida = this.seleccion();
    return {
      bebida: elegida === 'otro' ? null : elegida,
      porciones: this.porciones(),
      cafeinaMg: this.cafeinaMg(),
      hora: this.hora(),
    };
  });
  readonly total = computed(() => totalMg(this.registro()));
  readonly error = computed(() => (this.seleccion() ? errorRegistro(this.registro()) : null));
  readonly errorVisible = computed(() => (this.seleccion() === 'otro' && !this.mgTocado() ? null : this.error()));

  async ngOnInit(): Promise<void> {
    this.bebidas.set(await this.cafeina.obtenerBebidas());
    this.cargando.set(false);
  }

  icono(bebida: BebidaDto): Icono {
    return ICONOS.find(([patron]) => patron.test(bebida.nombre))?.[1] ?? 'cafe';
  }

  elegir(opcion: BebidaDto | 'otro'): void {
    this.seleccion.set(opcion);
    this.porciones.set(1);
    this.mgTocado.set(false);
    this.aviso.set('');
    this.errorGuardado.set('');
  }

  cambiarPorciones(delta: number): void {
    this.porciones.update((n) => Math.min(PORCIONES_MAX, Math.max(1, n + delta)));
  }

  cambiarMg(valor: string): void {
    this.cafeinaMg.set(valor === '' ? null : Number(valor));
    if (valor !== '') this.mgTocado.set(true);
  }

  async guardar(): Promise<void> {
    if (this.guardando() || this.error()) return;
    this.guardando.set(true);
    this.errorGuardado.set('');
    try {
      await this.cafeina.registrar(this.registro());
      this.aviso.set(navigator.onLine ? 'Café registrado.' : 'Guardado en tu teléfono. Se enviará cuando tengas señal.');
      this.seleccion.set(null);
      this.cafeinaMg.set(null);
      this.hora.set(horaActual());
    } catch {
      // Solo falla si no se pudo encolar en el teléfono (sin sesión o sin almacenamiento).
      this.errorGuardado.set('No se pudo guardar. Intenta de nuevo.');
    } finally {
      this.guardando.set(false);
    }
  }
}
