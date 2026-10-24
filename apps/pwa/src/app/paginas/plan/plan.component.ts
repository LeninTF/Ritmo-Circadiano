import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProximoTurnoComponent } from '../turnos/proximo-turno/proximo-turno.component';

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [CommonModule, ProximoTurnoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pagina">
      <h1>Mi plan del día</h1>
      <p class="subtitulo-plan">Aquí ves tu plan de sueño, luz y descanso según tu turno.</p>

      <!-- Tarjeta RF05: Tu próximo turno y confirmación/corrección -->
      <app-proximo-turno [idTurno]="idTurnoParam()" />
    </section>
  `,
  styles: `
    .pagina {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 20px;
      max-width: 390px;
      margin: 0 auto;

      h1 {
        font-size: 20px;
        font-weight: 700;
        margin: 0;
        color: var(--color-texto);
      }

      .subtitulo-plan {
        font-size: 13px;
        color: var(--color-texto-2);
        margin: 0;
      }
    }
  `,
})
export class PlanComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly idTurnoParam = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((qParams) => {
      const turnoIdQuery = qParams.get('turnoId');
      if (turnoIdQuery) {
        this.idTurnoParam.set(turnoIdQuery);
      }
    });

    this.route.paramMap.subscribe((params) => {
      const turnoIdParam = params.get('idTurno');
      if (turnoIdParam) {
        this.idTurnoParam.set(turnoIdParam);
      }
    });
  }
}
