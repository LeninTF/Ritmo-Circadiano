import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SesionService } from '../../auth/sesion.service';

@Component({
  selector: 'app-plataforma',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  styles: `
    .acciones { display: grid; gap: 12px; max-width: 480px; }
    .boton {
      min-height: 44px; display: inline-flex; align-items: center; justify-content: center;
      padding: 10px 16px; font: inherit; font-weight: 600; text-decoration: none;
      color: var(--color-texto); background: var(--color-superficie-2);
      border: 1px solid var(--color-borde); border-radius: var(--radio-boton); cursor: pointer;
    }
    .boton--fuerte { color: #fff; background: var(--color-boton-fuerte); border-color: var(--color-boton-fuerte); }
  `,
  template: `
    <section class="pagina">
      <h1>Plataforma</h1>
      @if (sesion.estaAutenticada()) {
        <p>
          Participante <strong>{{ sesion.codigoParticipante() }}</strong>
          · rol {{ sesion.rol() }}
        </p>
        <div class="acciones">
          <a class="boton boton--fuerte" routerLink="/plan">Ir a mi plan de hoy</a>
          @if (sesion.rol() === 'administrador') {
            <a class="boton" routerLink="/admin/parametros">Parámetros del sistema</a>
          }
          <button class="boton" type="button" (click)="salir()">Cerrar sesión</button>
        </div>
      } @else {
        <p>Ingresa o crea tu cuenta para participar en el estudio.</p>
        <div class="acciones">
          <a class="boton boton--fuerte" routerLink="/ingresar">Ingresar</a>
          <a class="boton" routerLink="/consentimiento">Quiero participar</a>
        </div>
      }
    </section>
  `,
})
export class PlataformaComponent {
  protected readonly sesion = inject(SesionService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected salir(): void {
    this.auth.cerrarSesion();
    void this.router.navigate(['/ingresar']);
  }
}
