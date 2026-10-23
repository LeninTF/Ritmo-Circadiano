import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SesionService } from '../../auth/sesion.service';
import { environment } from '../../../environments/environment';

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
    .aviso { font-size: 0.8125rem; color: var(--color-texto-2); }
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
            <button class="boton" type="button" (click)="exportar()">Exportar indicadores (CSV)</button>
            @if (avisoExportacion()) {
              <p class="aviso" role="status">{{ avisoExportacion() }}</p>
            }
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
  private readonly http = inject(HttpClient);
  protected readonly avisoExportacion = signal('');

  /** RF16: descarga el CSV seudonimizado (el token lo agrega el interceptor). */
  protected exportar(): void {
    this.avisoExportacion.set('');
    this.http
      .get(`${environment.apiUrl}/admin/export/indicadores.csv`, { responseType: 'blob' })
      .subscribe({
        next: (csv) => {
          const enlace = document.createElement('a');
          enlace.href = URL.createObjectURL(csv);
          enlace.download = 'indicadores-pretest.csv';
          enlace.click();
          URL.revokeObjectURL(enlace.href);
        },
        error: (e: HttpErrorResponse) =>
          this.avisoExportacion.set(
            e.status === 409
              ? 'Aún no hay 5 participantes con pretest: no se puede exportar sin riesgo de identificarlos.'
              : 'No se pudo exportar.',
          ),
      });
  }

  protected salir(): void {
    this.auth.cerrarSesion();
    void this.router.navigate(['/ingresar']);
  }
}
