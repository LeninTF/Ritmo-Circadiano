import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProximoTurnoComponent } from '../turnos/proximo-turno/proximo-turno.component';
import { PlanHoyComponent } from './plan-hoy.component';
import { PushService } from '../../core/push/push.service';

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [CommonModule, ProximoTurnoComponent, PlanHoyComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pagina">
      <h1>Mi plan del día</h1>
      <p class="subtitulo-plan">Aquí ves tu plan de sueño, luz y descanso según tu turno.</p>

      <button type="button" class="boton-push" (click)="solicitarPush()">
        {{ pushService.suscrito() ? '🔔 Recordatorios activados' : '🔔 Activar recordatorios push' }}
      </button>

      <!-- Tarjeta RF05: Tu próximo turno y confirmación/corrección -->
      <app-proximo-turno [idTurno]="idTurnoParam()" />

      <!-- RF07: plan circadiano del próximo turno (I3) -->
      <app-plan-hoy />
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

      .boton-push {
        min-height: 44px;
        padding: 0 16px;
        font: inherit;
        font-weight: 600;
        color: var(--color-superficie);
        background: var(--color-primario);
        border: 0;
        border-radius: var(--radio-boton, 8px);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  `,
})
export class PlanComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly pushService = inject(PushService);
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

  async solicitarPush(): Promise<void> {
    await this.pushService.solicitarSuscripcion();
  }
}
