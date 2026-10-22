import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IndicadoresService, PanelIndicadoresResponse } from './indicadores.service';

@Component({
  selector: 'app-indicadores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pagina">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
        <h1>Dashboard del Jefe de Operaciones (RF13)</h1>
      </div>

      <div style="background:var(--color-acento-fondo);padding:1rem;border-radius:0.5rem;margin-bottom:1.5rem;display:flex;gap:1rem;align-items:flex-end;flex-wrap:wrap;">
        <div>
          <label for="filtro-desde" style="display:block;font-size:0.85rem;margin-bottom:0.25rem;">Fecha Desde:</label>
          <input id="filtro-desde" type="date" [value]="desde()" (input)="desde.set($any($event.target).value)" style="padding:0.35rem;border-radius:0.25rem;border:1px solid var(--color-borde);" />
        </div>
        <div>
          <label for="filtro-hasta" style="display:block;font-size:0.85rem;margin-bottom:0.25rem;">Fecha Hasta:</label>
          <input id="filtro-hasta" type="date" [value]="hasta()" (input)="hasta.set($any($event.target).value)" style="padding:0.35rem;border-radius:0.25rem;border:1px solid var(--color-borde);" />
        </div>
        <div>
          <button class="btn" (click)="cargarPanel()">Filtrar Indicadores</button>
        </div>
      </div>

      @if (cargando()) {
        <p style="text-align:center;padding:2rem;">Cargando indicadores...</p>
      } @else if (resultado()) {
        @if (!resultado()?.suficiente) {
          <div style="background:#fef3c7;border:1px solid #f59e0b;color:#92400e;padding:1.5rem;border-radius:0.5rem;text-align:center;">
            <h3>Privacidad Protegida (k-Anonimato)</h3>
            <p style="margin-top:0.5rem;">
              No hay suficientes datos en la muestra seleccionada (se requiere un mínimo de 5 conductores distintos, <em>n &lt; 5</em>). Para preservar la privacidad de los colaboradores, no se muestran estadísticas agregadas.
            </p>
          </div>
        } @else {
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;">
            <div style="background:var(--color-fondo);border:1px solid var(--color-borde);padding:1.25rem;border-radius:0.5rem;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
              <div style="font-size:0.85rem;color:var(--color-texto-secundario);">Conductores Únicos (Muestra)</div>
              <div style="font-size:1.75rem;font-weight:700;margin-top:0.5rem;">{{ resultado()?.datos?.conductoresUnicos }}</div>
            </div>
            <div style="background:var(--color-fondo);border:1px solid var(--color-borde);padding:1.25rem;border-radius:0.5rem;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
              <div style="font-size:0.85rem;color:var(--color-texto-secundario);">Total Turnos Registrados</div>
              <div style="font-size:1.75rem;font-weight:700;margin-top:0.5rem;">{{ resultado()?.datos?.totalTurnos }}</div>
            </div>
            <div style="background:var(--color-fondo);border:1px solid var(--color-borde);padding:1.25rem;border-radius:0.5rem;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
              <div style="font-size:0.85rem;color:var(--color-texto-secundario);">Promedio Horas Conducción</div>
              <div style="font-size:1.75rem;font-weight:700;margin-top:0.5rem;">{{ resultado()?.datos?.promedioHorasConduccion }}h</div>
            </div>
            <div style="background:var(--color-fondo);border:1px solid var(--color-borde);padding:1.25rem;border-radius:0.5rem;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
              <div style="font-size:0.85rem;color:var(--color-texto-secundario);">Turnos Nocturnos</div>
              <div style="font-size:1.75rem;font-weight:700;margin-top:0.5rem;">{{ resultado()?.datos?.turnosNocturnos }}</div>
            </div>
          </div>
        }
      }
    </section>
  `,
})
export class IndicadoresComponent implements OnInit {
  private readonly svc = inject(IndicadoresService);

  desde = signal<string>('');
  hasta = signal<string>('');
  cargando = signal<boolean>(false);
  resultado = signal<PanelIndicadoresResponse | null>(null);

  ngOnInit(): void {
    this.cargarPanel();
  }

  cargarPanel(): void {
    this.cargando.set(true);
    this.svc.obtenerPanel(this.desde() || undefined, this.hasta() || undefined).subscribe({
      next: (res) => {
        this.resultado.set(res);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.resultado.set({ suficiente: false });
      },
    });
  }
}
