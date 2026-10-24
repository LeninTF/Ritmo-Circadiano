import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { PlanDiarioDto, SedeEmpresa } from '@circadiano/contracts';
import { ChipComponent } from '../../compartido/chip/chip.component';
import { MicroTarjetaComponent } from '../../compartido/micro-tarjeta/micro-tarjeta.component';
import { TarjetaComponent } from '../../compartido/tarjeta/tarjeta.component';
import { GeoService } from './geo.service';
import { PlanService, type PlanDelDia } from './plan.service';

type Estado = 'cargando' | 'listo' | 'sin_turno' | 'error';
type TipoBarra = 'ahora' | 'pico' | 'sueno' | 'normal';

const H = 3_600_000;
const ALTURA_BARRA: Record<TipoBarra, number> = { ahora: 70, pico: 95, sueno: 20, normal: 55 };
const FORMATO_HORA = new Intl.DateTimeFormat('es-PE', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'America/Lima',
});

/** RF07: "Mi plan de hoy" con ventana de descanso, cafeína, luz, pico y curva de 24 h. */
@Component({
  selector: 'app-plan-hoy',
  imports: [RouterLink, TarjetaComponent, MicroTarjetaComponent, ChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (estado()) {
      @case ('cargando') {
        <p class="nota" role="status">Calculando tu plan…</p>
      }
      @case ('sin_turno') {
        <app-tarjeta><p class="nota">No tienes turnos próximos. Cuando te asignen uno verás aquí tu plan.</p></app-tarjeta>
      }
      @case ('error') {
        <app-tarjeta>
          <p class="nota" role="alert">No pudimos cargar tu plan.</p>
          <button type="button" class="boton" (click)="cargar()">Reintentar</button>
        </app-tarjeta>
      }
      @case ('listo') {
        @if (datos(); as d) {
          @if (d.origen !== 'servidor') {
            <p class="aviso" role="status">
              Sin conexión: {{ d.origen === 'guardado' ? 'plan guardado en tu teléfono' : 'plan calculado en tu teléfono' }}.
            </p>
          }

          <app-tarjeta [heroe]="true">
            <span class="micro">VENTANA DE DESCANSO</span>
            <p class="rango">{{ hora(d.plan.inicioSueno) }} – {{ hora(d.plan.finSueno) }}</p>
            <p class="meta">
              {{ duracion(d.plan.inicioSueno, d.plan.finSueno) }} de sueño
              @if (d.plan.inicioSiesta && d.plan.finSiesta) {
                · siesta {{ hora(d.plan.inicioSiesta) }}–{{ hora(d.plan.finSiesta) }}
              }
            </p>
          </app-tarjeta>

          <div class="banda">
            <app-micro-tarjeta
              etiqueta="CAFÉ HASTA"
              color="alerta"
              [valor]="d.plan.horaCorteCafeina ? hora(d.plan.horaCorteCafeina) : 'Ya no'"
              [nota]="d.plan.horaCorteCafeina ? '' : 'Evita más cafeína hoy'"
            />
            <app-micro-tarjeta
              [etiqueta]="d.plan.protegerLuz ? 'EVITA LUZ' : 'LUZ NATURAL'"
              [color]="d.plan.protegerLuz ? 'alerta' : 'ok'"
              [valor]="d.plan.ventanaLuz ? hora(d.plan.ventanaLuz.inicio) : '—'"
              [nota]="d.plan.protegerLuz ? 'Lentes oscuros hasta dormir' : d.plan.ventanaLuz ? '60 min al aire libre' : ''"
            />
            <app-micro-tarjeta etiqueta="PRÓX. PICO" color="primario" [valor]="proximoPico()" />
          </div>

          <app-tarjeta>
            <h2>Tu energía en las próximas 24 h</h2>
            <div class="curva" aria-hidden="true">
              @for (b of barras(); track $index) {
                <span class="barra" [class]="b" [style.height.%]="altura(b)"></span>
              }
            </div>
            <p class="leyenda">Barra oscura: ahora · Altas: picos de energía · Bajas: horas de sueño.</p>
          </app-tarjeta>

          @if (d.sinUbicacion) {
            <app-tarjeta>
              <h2>¿Dónde descansas?</h2>
              <p class="nota">Así calculamos tu amanecer. Mientras tanto usamos Ica.</p>
              <div class="sedes">
                <button type="button" class="opcion" (click)="usarGps()" [disabled]="guardando()">
                  <app-chip>Usar mi ubicación</app-chip>
                </button>
                @for (sede of sedes; track sede.nombre) {
                  <button type="button" class="opcion" (click)="elegirSede(sede)" [disabled]="guardando()">
                    <app-chip>{{ sede.nombre }}</app-chip>
                  </button>
                }
              </div>
            </app-tarjeta>
          }

          <a class="enlace" routerLink="/cronotipo">Responder el cuestionario de cronotipo</a>
        }
      }
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    h2 {
      margin: 0 0 12px;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-texto);
    }
    .micro {
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.6px;
      color: var(--color-texto-2);
    }
    .rango {
      margin: 4px 0;
      font-size: 2.375rem;
      line-height: 1.15;
      font-weight: 700;
      color: var(--color-texto);
    }
    .meta,
    .nota,
    .leyenda {
      margin: 0;
      font-size: 0.8125rem;
      color: var(--color-texto-2);
    }
    .aviso {
      margin: 0;
      padding: 10px 12px;
      font-size: 0.8125rem;
      color: var(--color-texto);
      background: var(--color-alerta-fondo);
      border-radius: var(--radio-tile);
    }
    .banda {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .curva {
      display: flex;
      align-items: flex-end;
      gap: 3px;
      height: 90px;
      margin-bottom: 8px;
    }
    .barra {
      flex: 1;
      border-radius: var(--radio-barra);
      background: var(--color-borde);
    }
    .barra.pico {
      background: var(--color-primario);
    }
    .barra.ahora {
      background: var(--color-texto);
    }
    .barra.sueno {
      background: var(--color-superficie-2);
    }
    .sedes {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    .opcion {
      padding: 0;
      background: none;
      border: 0;
      cursor: pointer;
    }
    .boton {
      min-height: 44px;
      margin-top: 12px;
      padding: 0 16px;
      font: inherit;
      font-weight: 600;
      color: var(--color-superficie);
      background: var(--color-primario);
      border: 0;
      border-radius: var(--radio-boton);
    }
    .enlace {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--color-primario);
    }
  `,
})
export class PlanHoyComponent implements OnInit {
  private readonly planes = inject(PlanService);
  private readonly geo = inject(GeoService);

  readonly sedes = this.geo.sedes;
  readonly estado = signal<Estado>('cargando');
  readonly datos = signal<PlanDelDia | null>(null);
  readonly guardando = signal(false);
  private readonly ahora = signal(new Date());

  readonly proximoPico = computed(() => {
    const plan = this.datos()?.plan;
    const ahora = this.ahora().getTime();
    const pico = plan?.picos.find((p) => Date.parse(p.fin) > ahora);
    return pico ? this.hora(pico.inicio) : '—';
  });

  readonly barras = computed<TipoBarra[]>(() => {
    const plan = this.datos()?.plan;
    if (!plan) return [];
    const inicio = Math.floor(this.ahora().getTime() / H) * H;
    return Array.from({ length: 24 }, (_, i) => (i === 0 ? 'ahora' : tipoDeHora(plan, inicio + i * H)));
  });

  ngOnInit(): void {
    void this.cargar();
  }

  async cargar(): Promise<void> {
    this.estado.set('cargando');
    this.ahora.set(new Date());
    try {
      const datos = await this.planes.obtenerPlanDelDia(this.ahora());
      this.datos.set(datos);
      this.estado.set(datos ? 'listo' : 'sin_turno');
    } catch {
      this.estado.set('error');
    }
  }

  async elegirSede(sede: SedeEmpresa): Promise<void> {
    await this.registrar(() => this.geo.registrar(sede));
  }

  async usarGps(): Promise<void> {
    await this.registrar(async () => {
      const ubicacion = await this.geo.obtenerPorGps();
      // Sin permiso o sin señal: el trabajador elige una sede de la lista.
      if (ubicacion) await this.geo.registrar(ubicacion);
    });
  }

  hora(iso: string): string {
    return FORMATO_HORA.format(new Date(iso));
  }

  duracion(inicio: string, fin: string): string {
    const minutos = Math.round((Date.parse(fin) - Date.parse(inicio)) / 60_000);
    const resto = minutos % 60;
    return `${Math.floor(minutos / 60)} h${resto ? ` ${resto} min` : ''}`;
  }

  altura(tipo: TipoBarra): number {
    return ALTURA_BARRA[tipo];
  }

  private async registrar(accion: () => Promise<unknown>): Promise<void> {
    this.guardando.set(true);
    try {
      await accion();
      await this.cargar();
    } catch {
      this.estado.set('error');
    } finally {
      this.guardando.set(false);
    }
  }
}

function dentro(t: number, inicio: string | null, fin: string | null): boolean {
  return inicio !== null && fin !== null && t >= Date.parse(inicio) && t < Date.parse(fin);
}

function tipoDeHora(plan: PlanDiarioDto, t: number): TipoBarra {
  if (dentro(t, plan.inicioSueno, plan.finSueno) || dentro(t, plan.inicioSiesta, plan.finSiesta)) return 'sueno';
  if (plan.picos.some((p) => dentro(t, p.inicio, p.fin))) return 'pico';
  return 'normal';
}
