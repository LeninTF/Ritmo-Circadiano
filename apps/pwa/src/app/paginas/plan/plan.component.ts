import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProximoTurnoComponent } from '../turnos/proximo-turno/proximo-turno.component';
import { PlanHoyComponent } from './plan-hoy.component';
import { PushService } from '../../core/push/push.service';
import { GuiaInstalacionIosComponent } from '../../compartido/guia-instalacion-ios/guia-instalacion-ios.component';

/** Texto para cuando no se pudo activar push; 'suscrito' e iOS no lo necesitan. */
const AVISO_PUSH: Partial<Record<string, string>> = {
  'no-disponible': 'Este navegador no permite recordatorios push.',
  error: 'No se pudieron activar los recordatorios. Revisa los permisos e inténtalo de nuevo.',
};

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [CommonModule, ProximoTurnoComponent, PlanHoyComponent, GuiaInstalacionIosComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pagina">
      <h1>Mi plan del día</h1>
      <p class="subtitulo-plan">Aquí ves tu plan de sueño, luz y descanso según tu turno.</p>

      <button type="button" class="boton-push" [disabled]="pushService.suscrito()" (click)="solicitarPush()">
        {{ pushService.suscrito() ? 'Recordatorios activados' : 'Activar recordatorios' }}
      </button>
      @if (avisoPush()) {
        <p class="aviso-push" role="status">{{ avisoPush() }}</p>
      }
      @if (mostrarGuiaIos()) {
        <app-guia-instalacion-ios (cerrar)="mostrarGuiaIos.set(false)" />
      }

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
        min-height: var(--alto-boton-secundario);
        padding: 0 16px;
        font: inherit;
        font-size: 1.0625rem;
        font-weight: 600;
        color: var(--color-texto);
        background: var(--color-superficie-2);
        border: 0;
        border-radius: var(--radio-boton);
        cursor: pointer;
      }

      .boton-push:disabled {
        color: var(--color-ok-texto);
        cursor: default;
      }

      .aviso-push {
        margin: 0;
        font-size: 0.875rem;
        color: var(--color-texto-2);
      }
    }
  `,
})
export class PlanComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly pushService = inject(PushService);
  readonly idTurnoParam = signal<string | null>(null);
  readonly mostrarGuiaIos = signal(false);
  readonly avisoPush = signal<string | null>(null);

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
    const resultado = await this.pushService.solicitarSuscripcion();
    this.mostrarGuiaIos.set(resultado === 'ios-sin-instalar');
    this.avisoPush.set(AVISO_PUSH[resultado] ?? null);
  }
}
