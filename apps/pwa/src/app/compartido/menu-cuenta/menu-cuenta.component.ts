import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { Rol } from '@circadiano/contracts';
import { AuthService } from '../../auth/auth.service';
import { SesionService } from '../../auth/sesion.service';
import { OfflineStoreService } from '../../core/offline/offline-store.service';

const NOMBRE_ROL: Record<Rol, string> = {
  trabajador: 'Trabajador',
  jefe_operaciones: 'Jefe de operaciones',
  despachador: 'Despachador',
  administrador: 'Administrador',
};

/** Botón de cuenta en la cabecera: código, rol y cierre de sesión con confirmación. */
@Component({
  selector: 'app-menu-cuenta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: contents; }
    .boton-cuenta {
      display: inline-flex; align-items: center; justify-content: center;
      width: var(--alto-tactil); height: var(--alto-tactil); padding: 0;
      color: var(--color-texto); background: var(--color-superficie-2);
      border: 1px solid var(--color-borde); border-radius: 50%; cursor: pointer;
    }
    svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .fondo { position: fixed; inset: 0; z-index: 30; display: flex; align-items: flex-end; justify-content: center; background: rgb(0 0 0 / 0.5); }
    .hoja {
      display: grid; gap: 16px; width: 100%; max-width: 480px;
      padding: 24px 20px calc(20px + env(safe-area-inset-bottom));
      color: var(--color-texto); background: var(--color-superficie);
      border-radius: var(--radio-hoja) var(--radio-hoja) 0 0; box-shadow: var(--sombra-hoja);
    }
    h2 { margin: 0; font-size: 1.125rem; line-height: 1.5rem; }
    dl { display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; margin: 0; }
    dt { font-size: 0.875rem; font-weight: 500; color: var(--color-texto-3); }
    dd { margin: 0; font-weight: 600; font-variant-numeric: tabular-nums; }
    .aviso {
      margin: 0; padding: 12px 16px; color: var(--color-alerta-texto); background: var(--color-alerta-fondo);
      border: 1px solid var(--color-alerta); border-radius: var(--radio-tile);
    }
    .boton {
      min-height: var(--alto-boton-secundario); font: inherit; font-size: 1.0625rem; font-weight: 600; cursor: pointer;
      color: var(--color-texto); background: var(--color-superficie-2);
      border: 1px solid var(--color-borde); border-radius: var(--radio-boton);
    }
    .boton--peligro { min-height: var(--alto-boton-primario); color: var(--color-peligro-texto); border-color: var(--color-peligro); }
    .boton:disabled { opacity: 0.6; cursor: wait; }
  `,
  template: `
    @if (sesion.estaAutenticada()) {
      <button
        class="boton-cuenta"
        type="button"
        aria-label="Mi cuenta"
        aria-haspopup="dialog"
        [attr.aria-expanded]="abierto()"
        (click)="abrir()"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      </button>
    }

    @if (abierto()) {
      <div class="fondo" (click)="cerrar()" (keydown.escape)="cerrar()" tabindex="-1">
        <div
          class="hoja"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-cuenta"
          tabindex="-1"
          (click)="$event.stopPropagation()"
          (keydown)="$event.stopPropagation()"
          (keydown.escape)="cerrar()"
        >
          <h2 id="titulo-cuenta">Mi cuenta</h2>
          <dl>
            <dt>Código</dt>
            <dd>{{ sesion.codigoParticipante() }}</dd>
            <dt>Rol</dt>
            <dd>{{ nombreRol() }}</dd>
          </dl>

          @if (pendientes() > 0) {
            <p class="aviso" role="status">
              Tienes {{ pendientes() }} {{ pendientes() === 1 ? 'registro' : 'registros' }} sin sincronizar.
              Si cierras sesión ahora, se borrarán de este dispositivo.
            </p>
          }

          @if (confirmando()) {
            <p>¿Seguro que quieres cerrar sesión?</p>
            <button class="boton boton--peligro" type="button" [disabled]="saliendo()" (click)="salir()">
              {{ saliendo() ? 'Cerrando…' : 'Sí, cerrar sesión' }}
            </button>
            <button class="boton" type="button" (click)="confirmando.set(false)">Cancelar</button>
          } @else {
            <button class="boton boton--peligro" type="button" (click)="confirmando.set(true)">Cerrar sesión</button>
            <button class="boton" type="button" (click)="cerrar()">Volver</button>
          }
        </div>
      </div>
    }
  `,
})
export class MenuCuentaComponent {
  protected readonly sesion = inject(SesionService);
  private readonly auth = inject(AuthService);
  private readonly offline = inject(OfflineStoreService);
  private readonly router = inject(Router);

  protected readonly abierto = signal(false);
  protected readonly confirmando = signal(false);
  protected readonly saliendo = signal(false);
  protected readonly pendientes = signal(0);

  protected nombreRol(): string {
    const rol = this.sesion.rol();
    return rol ? NOMBRE_ROL[rol] : '';
  }

  protected async abrir(): Promise<void> {
    this.confirmando.set(false);
    this.abierto.set(true);
    try {
      this.pendientes.set((await this.offline.getPendingOutbox()).length);
    } catch {
      // Sin Dexie (navegador privado) no hay cola que avisar.
      this.pendientes.set(0);
    }
  }

  protected cerrar(): void {
    this.abierto.set(false);
  }

  protected async salir(): Promise<void> {
    this.saliendo.set(true);
    try {
      await this.auth.cerrarSesion();
    } finally {
      this.saliendo.set(false);
      this.abierto.set(false);
      await this.router.navigate(['/ingresar']);
    }
  }
}
