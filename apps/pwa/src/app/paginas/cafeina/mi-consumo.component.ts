import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import type { PlanDiarioDto } from '@circadiano/contracts';
import { PlanService } from '../plan/plan.service';
import { CafeinaService, horaLima, mensajeCafeinaActiva, type ConsumoItem, type MiConsumo } from './cafeina.service';

const INICIAL_DIA = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const NOMBRE_DIA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const diaSemana = (fecha: string) => new Date(`${fecha}T12:00:00Z`).getUTCDay();

/** RF09 · HU-04 y HU-05: cuánta cafeína llevo, cuánta tengo activa y mis registros de hoy. */
@Component({
  selector: 'app-mi-consumo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <main class="pagina" aria-labelledby="titulo-consumo">
      <h1 id="titulo-consumo">Mi consumo</h1>
      <p class="aviso" role="status">{{ aviso() }}</p>

      @if (estado() === 'cargando') {
        <p role="status" class="texto-2">Cargando tu consumo…</p>
      } @else if (estado() === 'error') {
        <p class="error" role="alert">Algo salió mal. Intenta de nuevo en unos segundos.</p>
        <button type="button" class="secundario" (click)="cargar()">Reintentar</button>
      } @else if (datos(); as d) {
        @if (d.sinSenal) {
          <p class="nota">Sin señal: calculado con lo registrado en este teléfono.</p>
        }

        <section class="tarjeta" aria-labelledby="titulo-activa">
          <h2 id="titulo-activa" class="micro">Cafeína activa ahora</h2>
          <p class="estado" [class.alto]="!nivelBajo()">
            <span class="icono" aria-hidden="true">
              @if (nivelBajo()) {
                <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
              } @else {
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              }
            </span>
            {{ nivelBajo() ? 'Nivel bajo' : 'Todavía activa' }}
          </p>
          <p class="cifra-heroe">~{{ d.resumen.cafeinaActiva.mg }} <span class="unidad">mg</span></p>
          <p class="mensaje">{{ mensaje() }}</p>
          @if (!nivelBajo()) {
            <div class="alternativa">
              <p class="micro">Alternativa sin cafeína</p>
              <p class="texto-2">Prueba una infusión de hierbas o agua para mantenerte hidratado sin afectar tu descanso.</p>
            </div>
          }
          <p class="pie">Estimación aproximada, no es un dato médico.</p>
        </section>

        <section class="tarjeta" aria-labelledby="titulo-hoy">
          <h2 id="titulo-hoy" class="micro">Hoy</h2>
          <p class="cifra">{{ d.resumen.hoy.totalMg }} mg · {{ d.resumen.hoy.conteo }} {{ d.resumen.hoy.conteo === 1 ? 'registro' : 'registros' }}</p>
        </section>

        <section class="tarjeta" aria-labelledby="titulo-semana">
          <h2 id="titulo-semana" class="micro">Últimos 7 días</h2>
          <p class="texto-2">Promedio: {{ promedio() }} mg por día</p>
          <ol class="barras">
            @for (dia of barras(); track dia.fecha) {
              <li [attr.aria-label]="dia.etiqueta">
                <span class="valor" aria-hidden="true">{{ dia.totalMg || '' }}</span>
                <span class="barra" [class.hoy]="$last" [style.height.%]="dia.alto" aria-hidden="true"></span>
                <span class="dia" aria-hidden="true">{{ dia.inicial }}</span>
              </li>
            }
          </ol>
        </section>

        <section aria-labelledby="titulo-registros">
          <h2 id="titulo-registros" class="micro">Registros de hoy</h2>
          @if (d.items.length === 0) {
            <p class="vacio">Aún no registras consumos. Empieza con tu primer café.</p>
          } @else {
            <ul class="lista">
              @for (item of d.items; track item.clientId) {
                <li class="fila">
                  <span class="hora">{{ hora(item.fechaHora) }}</span>
                  <span class="detalle">
                    <span class="nombre">{{ item.nombre }}</span>
                    <span class="texto-2">{{ item.cafeinaMg }} mg{{ item.pendiente ? ' · Pendiente de enviar' : '' }}</span>
                  </span>
                  @if (item.idIngesta !== null) {
                    <button type="button" class="eliminar" (click)="pedirConfirmacion(item)"
                      [disabled]="eliminando() === item.clientId" [attr.aria-expanded]="confirmando() === item.clientId"
                      [attr.aria-label]="'Eliminar ' + item.nombre + ' de las ' + hora(item.fechaHora)">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  }
                  @if (confirmando() === item.clientId) {
                    <div class="confirmar" role="group" [attr.aria-label]="'Confirmar eliminación de ' + item.nombre"
                      (keydown.escape)="cancelarConfirmacion()">
                      <span>¿Eliminar este registro?</span>
                      <button type="button" class="si" [id]="'confirmar-' + item.clientId" (click)="eliminar(item)"
                        [disabled]="eliminando() === item.clientId">Sí, eliminar</button>
                      <button type="button" class="no" (click)="cancelarConfirmacion()">Cancelar</button>
                    </div>
                  }
                </li>
              }
            </ul>
          }
          <p class="error" role="alert">{{ errorEliminar() }}</p>
        </section>
      }

      <a class="primario" routerLink="/cafeina/nuevo">Registrar café</a>
    </main>
  `,
  styles: `
    .pagina { max-width: 480px; margin: 0 auto; padding: 24px 20px 32px; display: grid; gap: 16px; }
    h1 { margin: 0; font-size: 1.5rem; line-height: 2rem; font-weight: 700; }
    .micro {
      margin: 0; font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;
      color: var(--color-texto-2);
    }
    .texto-2 { margin: 0; color: var(--color-texto-2); font-size: 0.875rem; }
    .tarjeta {
      display: grid; gap: 8px; padding: 20px; background: var(--color-superficie);
      border: 1px solid var(--color-borde); border-radius: var(--radio-tarjeta);
    }
    .estado {
      display: inline-flex; align-items: center; gap: 6px; justify-self: start; margin: 0; padding: 4px 12px;
      font-size: 0.875rem; font-weight: 600; border-radius: var(--radio-chip);
      color: var(--color-ok-texto); background: var(--color-superficie-2);
    }
    .estado.alto { color: var(--color-alerta-texto); background: var(--color-alerta-fondo); }
    .icono { display: inline-grid; }
    svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .cifra-heroe { margin: 0; font-size: 2.5rem; line-height: 2.875rem; font-weight: 700; font-variant-numeric: tabular-nums; }
    .unidad { font-size: 1.125rem; font-weight: 600; color: var(--color-texto-2); }
    .mensaje { margin: 0; font-size: 1rem; line-height: 1.5rem; }
    .alternativa {
      display: grid; gap: 4px; padding: 12px; background: var(--color-superficie-2);
      border-left: 4px solid var(--color-primario); border-radius: var(--radio-tile);
    }
    .pie { margin: 0; font-size: 0.8125rem; color: var(--color-texto-3); }
    .cifra { margin: 0; font-size: 1.375rem; font-weight: 700; font-variant-numeric: tabular-nums; }
    .barras { list-style: none; margin: 8px 0 0; padding: 0; display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; height: 160px; }
    .barras li { display: grid; grid-template-rows: auto 1fr auto; justify-items: center; align-items: end; gap: 4px; }
    .barra {
      width: 100%; max-width: 32px; min-height: 2px; align-self: end;
      background: var(--color-barra-inactiva); border-radius: var(--radio-barra) var(--radio-barra) 0 0;
    }
    .barra.hoy { background: var(--color-primario); }
    .valor { font-size: 0.8125rem; font-weight: 600; color: var(--color-texto-2); font-variant-numeric: tabular-nums; }
    .dia { font-size: 0.8125rem; color: var(--color-texto-3); }
    .lista { list-style: none; margin: 8px 0 0; padding: 0; display: grid; gap: 8px; }
    .fila {
      display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; min-height: 64px;
      padding: 8px 12px; background: var(--color-superficie); border: 1px solid var(--color-borde); border-radius: 12px;
    }
    .hora { font-size: 1.25rem; font-weight: 700; font-variant-numeric: tabular-nums; }
    .detalle { display: grid; }
    .nombre { font-weight: 600; overflow-wrap: anywhere; }
    .eliminar {
      display: grid; place-items: center; width: var(--alto-tactil); height: var(--alto-tactil); cursor: pointer;
      color: var(--color-peligro-texto); background: transparent; border: 0; border-radius: 50%;
    }
    .eliminar svg { width: 22px; height: 22px; }
    .eliminar:disabled { opacity: 0.4; cursor: not-allowed; }
    .confirmar {
      grid-column: 1 / -1; display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
      padding-top: 8px; border-top: 1px solid var(--color-borde); font-weight: 500;
    }
    .confirmar span { flex: 1 1 100%; }
    .confirmar button {
      flex: 1 1 0; min-height: var(--alto-tactil); font: inherit; font-weight: 600; cursor: pointer;
      border: 0; border-radius: var(--radio-boton);
    }
    .confirmar .si { color: var(--color-peligro-texto); background: var(--color-peligro-fondo); }
    .confirmar .no { color: var(--color-texto); background: var(--color-superficie-2); }
    .vacio { margin: 8px 0 0; color: var(--color-texto-2); }
    .nota { margin: 0; padding: 12px 14px; border-radius: 12px; background: var(--color-superficie-2); color: var(--color-texto-2); }
    .aviso { margin: 0; color: var(--color-ok-texto); font-weight: 500; }
    .error { margin: 0; color: var(--color-peligro-texto); font-weight: 500; }
    .aviso:empty, .error:empty { display: none; }
    .primario, .secundario {
      display: grid; place-items: center; width: 100%; font: inherit; font-size: 1.0625rem; font-weight: 600;
      text-decoration: none; cursor: pointer; border: 0; border-radius: var(--radio-boton);
    }
    .primario { min-height: var(--alto-boton-primario); color: var(--color-sobre-primario); background: var(--color-primario); }
    .secundario { min-height: var(--alto-boton-secundario); color: var(--color-texto); background: var(--color-superficie-2); }
  `,
})
export class MiConsumoComponent implements OnInit {
  private readonly cafeina = inject(CafeinaService);
  private readonly planes = inject(PlanService);
  private readonly injector = inject(Injector);

  readonly estado = signal<'cargando' | 'listo' | 'error'>('cargando');
  readonly datos = signal<MiConsumo | null>(null);
  readonly plan = signal<PlanDiarioDto | null>(null);
  readonly eliminando = signal<string | null>(null);
  readonly confirmando = signal<string | null>(null);
  readonly errorEliminar = signal('');
  /** Lo deja /cafeina/nuevo al guardar («Café registrado»). */
  readonly aviso = signal<string>(inject(Router).currentNavigation()?.extras.state?.['aviso'] ?? '');

  readonly nivelBajo = computed(() => this.datos()?.resumen.cafeinaActiva.horaNivelBajo === null);
  readonly mensaje = computed(() => {
    const d = this.datos();
    return d ? mensajeCafeinaActiva(d.resumen.cafeinaActiva, this.plan()) : '';
  });
  readonly promedio = computed(() => {
    const dias = this.datos()?.resumen.dias ?? [];
    return dias.length ? Math.round(dias.reduce((t, d) => t + d.totalMg, 0) / dias.length) : 0;
  });
  readonly barras = computed(() => {
    const dias = this.datos()?.resumen.dias ?? [];
    const maximo = Math.max(1, ...dias.map((d) => d.totalMg));
    return dias.map((d, i) => ({
      ...d,
      alto: (d.totalMg / maximo) * 100,
      inicial: INICIAL_DIA[diaSemana(d.fecha)],
      etiqueta: `${i === dias.length - 1 ? 'Hoy' : NOMBRE_DIA[diaSemana(d.fecha)]}: ${d.totalMg} mg`,
    }));
  });

  ngOnInit(): void {
    void this.cargar();
  }

  async cargar(): Promise<void> {
    this.estado.set('cargando');
    try {
      const [datos, plan] = await Promise.all([this.cafeina.obtenerMiConsumo(), this.leerPlan()]);
      this.datos.set(datos);
      this.plan.set(plan);
      this.estado.set('listo');
    } catch {
      this.estado.set('error');
    }
  }

  hora(iso: string): string {
    return horaLima(iso);
  }

  /** Confirmación en la misma fila: el foco pasa a «Sí, eliminar»; Escape o «Cancelar» la cierran. */
  pedirConfirmacion(item: ConsumoItem): void {
    this.confirmando.set(item.clientId);
    this.errorEliminar.set('');
    afterNextRender(() => document.getElementById(`confirmar-${item.clientId}`)?.focus(), {
      injector: this.injector,
    });
  }

  cancelarConfirmacion(): void {
    this.confirmando.set(null);
  }

  async eliminar(item: ConsumoItem): Promise<void> {
    this.eliminando.set(item.clientId);
    this.errorEliminar.set('');
    try {
      await this.cafeina.eliminar(item);
      this.confirmando.set(null);
      this.aviso.set('Registro eliminado.');
      await this.cargar();
    } catch {
      this.errorEliminar.set(
        navigator.onLine ? 'No se pudo eliminar. Intenta de nuevo.' : 'Necesitas señal para eliminar un registro.',
      );
    } finally {
      this.eliminando.set(null);
    }
  }

  /** Sin plan (sin turno o sin señal y sin copia) la tarjeta muestra solo la hora de bajada. */
  private async leerPlan(): Promise<PlanDiarioDto | null> {
    try {
      return (await this.planes.obtenerPlanDelDia())?.plan ?? null;
    } catch {
      return null;
    }
  }
}
