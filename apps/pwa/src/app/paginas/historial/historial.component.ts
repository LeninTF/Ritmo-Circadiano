import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { HistorialDiaDto } from '@circadiano/contracts';
import { BehaviorSubject, catchError, map, of, switchMap, tap } from 'rxjs';
import { HistorialService, PeriodoHistorial } from './historial.service';

import { HistorialGraficoComponent } from './historial-grafico.component';
import { fechaCivil } from './historial-fecha';
export { fechaCivil } from './historial-fecha';

@Component({
  selector: 'app-historial',
  imports: [CommonModule, HistorialGraficoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss',
})
export class HistorialComponent {
  private readonly servicio = inject(HistorialService);
  private readonly solicitudes = new BehaviorSubject<PeriodoHistorial>(7);
  readonly periodo = signal<PeriodoHistorial>(7);
  readonly periodos = [7, 14, 30] as const;
  readonly dias = signal<HistorialDiaDto[]>([]);
  readonly cargando = signal(true);
  readonly error = signal(false);
  readonly fechaCivil = fechaCivil;
  readonly graficos = [
    { campo: 'horasSueno', titulo: 'Horas de sueño', unidad: 'h' },
    { campo: 'cafeinaResidual', titulo: 'Cafeína residual', unidad: 'mg' },
  ] as const;

  readonly progresoSueno = computed(() => {
    const lista = this.dias();
    const conSueno = lista.filter(d => d.horasSueno !== null);
    const denom = conSueno.length;
    if (denom === 0) return 'No hay registros de sueño en este período.';
    const num = conSueno.filter(d => (d.horasSueno as number) >= 7).length;
    return `Dormiste 7 h o más en ${num} de ${denom} ${denom === 1 ? 'noche registrada' : 'noches registradas'}.`;
  });

  readonly progresoDiario = computed(() => {
    const lista = this.dias();
    const denom = lista.length;
    if (denom === 0) return 'No hay días en este período.';
    const num = lista.filter(d => d.diarioRegistrado).length;
    return `Registraste tu diario ${num} de ${denom} ${denom === 1 ? 'día' : 'días'}.`;
  });


  constructor() {
    this.solicitudes.pipe(
      tap(() => { this.cargando.set(true); this.error.set(false); this.dias.set([]); }),
      switchMap(periodo => this.servicio.obtener(periodo).pipe(
        map(respuesta => [...respuesta.dias].sort((a, b) => a.fecha.localeCompare(b.fecha))),
        catchError(() => { this.error.set(true); return of([]); }),
      )),
      takeUntilDestroyed(inject(DestroyRef)),
    ).subscribe(dias => { this.dias.set(dias); this.cargando.set(false); });
  }

  seleccionar(periodo: PeriodoHistorial): void {
    this.periodo.set(periodo);
    this.solicitudes.next(periodo);
  }
}
