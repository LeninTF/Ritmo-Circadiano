import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import type { EvaluacionDespacho } from '@circadiano/contracts';
import { SemaforoAptitudComponent } from '../../compartido/semaforo-aptitud/semaforo-aptitud.component';
import { TarjetaComponent } from '../../compartido/tarjeta/tarjeta.component';
import { ESTILOS_FORMULARIO } from '../../auth/estilos-formulario';
import { AptitudService, fechaLocal } from '../aptitud/aptitud.service';

// El 401 lo resuelve el authInterceptor (renueva o cierra la sesión).
const MENSAJE_POR_ESTADO: Record<number, string> = {
  0: 'Sin conexión. No se pudo consultar.',
  400: 'Revisa la fecha y el código.',
  403: 'Esta vista es solo para el despachador.',
};

/** RF12 / RN10: colores del semáforo que los conductores decidieron compartir en el día. */
@Component({
  selector: 'app-despacho-aptitud',
  imports: [ReactiveFormsModule, SemaforoAptitudComponent, TarjetaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    ESTILOS_FORMULARIO,
    `
      .pagina { display: grid; gap: 14px; }
      .lista { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; }
      .fila { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 44px; }
      .fila .participante { font-size: 0.875rem; font-weight: 600; color: var(--color-texto); }
    `,
  ],
  template: `
    <section class="pagina">
      <h1>Pre-salida del día</h1>
      <p>Solo aparecen los conductores que compartieron su resultado. No se muestran horas de sueño ni respuestas.</p>

      <app-tarjeta>
        <form [formGroup]="formulario" (ngSubmit)="consultar()">
          <label for="fecha">
            Fecha
            <input type="date" id="fecha" formControlName="fecha" />
          </label>
          <label for="codigo">
            Código de participante (P01)
            <input type="text" id="codigo" formControlName="codigo" placeholder="Todos" autocomplete="off" />
          </label>
          <button class="boton" type="submit" [disabled]="consultando() || formulario.invalid">Consultar</button>
        </form>
        @if (error()) {
          <p class="error" role="alert">{{ error() }}</p>
        }
      </app-tarjeta>

      @if (evaluaciones().length > 0) {
        <app-tarjeta>
          <ul class="lista">
            @for (e of evaluaciones(); track $index) {
              <li class="fila">
                <span class="participante">{{ e.codigo }}</span>
                <app-semaforo-aptitud [color]="e.color" />
              </li>
            }
          </ul>
        </app-tarjeta>
      } @else if (consultado() && !error()) {
        <app-tarjeta>
          <p role="status">Nadie ha compartido su resultado para esta búsqueda.</p>
        </app-tarjeta>
      }
    </section>
  `,
})
export class DespachoAptitudComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly aptitudService = inject(AptitudService);

  protected readonly formulario = this.fb.group({
    fecha: [fechaLocal(new Date()), [Validators.required]],
    codigo: ['', [Validators.maxLength(10)]],
  });

  protected readonly evaluaciones = signal<readonly EvaluacionDespacho[]>([]);
  protected readonly consultando = signal(false);
  protected readonly consultado = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    void this.consultar();
  }

  protected async consultar(): Promise<void> {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { fecha, codigo } = this.formulario.getRawValue();
    const codigoLimpio = codigo.trim().toUpperCase();

    this.consultando.set(true);
    this.error.set(null);
    try {
      const respuesta = await firstValueFrom(
        this.aptitudService.consultarDespacho({ fecha, ...(codigoLimpio && { codigo: codigoLimpio }) }),
      );
      this.evaluaciones.set(respuesta.evaluaciones);
    } catch (e: unknown) {
      this.evaluaciones.set([]);
      this.error.set(
        (e instanceof HttpErrorResponse && MENSAJE_POR_ESTADO[e.status]) || 'No se pudo consultar. Inténtalo de nuevo.',
      );
    } finally {
      this.consultando.set(false);
      this.consultado.set(true);
    }
  }
}
