import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { HistorialDiaDto } from '@circadiano/contracts';
import { BehaviorSubject, catchError, map, of, switchMap, tap } from 'rxjs';
import { HistorialService, PeriodoHistorial } from './historial.service';

import { HistorialGraficoComponent } from './historial-grafico.component';
import { fechaCivil } from './historial-fecha';
export { fechaCivil } from './historial-fecha';

@Component({
  selector: 'app-historial',
  imports: [HistorialGraficoComponent],
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
