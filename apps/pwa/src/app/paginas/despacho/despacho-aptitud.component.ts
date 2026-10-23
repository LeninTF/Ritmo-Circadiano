import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ConsultarDespachoRequest, EvaluacionDespacho } from '@circadiano/contracts';
import { SemaforoAptitudComponent } from '../../compartido/semaforo-aptitud/semaforo-aptitud.component';
import { TarjetaComponent } from '../../compartido/tarjeta/tarjeta.component';
import { ESTILOS_FORMULARIO } from '../../auth/estilos-formulario';
import { AptitudService } from '../aptitud/aptitud.service';

@Component({
  selector: 'app-despacho-aptitud',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SemaforoAptitudComponent,
    TarjetaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ESTILOS_FORMULARIO,
  template: `
    <section class="pagina">
      <header class="encabezado-pagina">
        <h1>Despacho — Evaluaciones de aptitud</h1>
        <p class="ayuda">Consulta el semáforo de aptitud de los conductores por turno y fecha.</p>
      </header>

      <app-tarjeta>
        <h2>Filtros</h2>
        <form [formGroup]="formulario" (ngSubmit)="consultar()">
          <div class="fila-formulario">
            <div class="campo">
              <label for="codigo">Código de turno</label>
              <input type="text" id="codigo" formControlName="codigo" placeholder="Ej: T-123" />
            </div>
            <div class="campo">
              <label for="fecha">Fecha</label>
              <input type="date" id="fecha" formControlName="fecha" />
            </div>
          </div>
          <button class="boton" type="submit" [disabled]="consultando()">Consultar</button>
        </form>

        @if (error()) {
          <p class="error" role="alert">{{ error() }}</p>
        }
      </app-tarjeta>

      @if (evaluaciones().length > 0) {
        <app-tarjeta>
          <h2>Evaluaciones ({{ evaluaciones().length }})</h2>
          <ul class="lista-evaluaciones" role="list">
            @for (e of evaluaciones(); track e.codigo) {
              <li class="fila-evaluacion">
                <span class="codigo">{{ e.codigo }}</span>
                <app-semaforo-aptitud [color]="e.color" />
              </li>
            }
          </ul>
        </app-tarjeta>
      } @else if (consultado()) {
        <app-tarjeta>
          <p class="vacio" role="status">No hay evaluaciones para los filtros seleccionados.</p>
        </app-tarjeta>
      }
    </section>
  `,
})
export class DespachoAptitudComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly aptitudService = inject(AptitudService);

  protected readonly formulario = this.fb.group({
    codigo: ['', [Validators.required, Validators.maxLength(20)]],
    fecha: [this.fechaHoy(), [Validators.required]],
  });

  protected readonly evaluaciones = signal<readonly EvaluacionDespacho[]>([]);
  protected readonly consultando = signal(false);
  protected readonly consultado = signal(false);
  protected readonly error = signal<string | null>(null);

  private fechaHoy(): string {
    return new Date().toISOString().split('T')[0];
  }

  protected async consultar(): Promise<void> {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.consultando.set(true);
    this.error.set(null);

    const codigo = this.formulario.value.codigo;
    const fecha = this.formulario.value.fecha;

    if (!codigo || !fecha) {
      this.consultando.set(false);
      return;
    }

    const request: ConsultarDespachoRequest = {
      codigo,
      fecha,
    };

    try {
      const respuesta = await this.aptitudService.consultarDespacho(request).toPromise();
      this.evaluaciones.set(respuesta?.evaluaciones ?? []);
    } catch (e: unknown) {
      const httpError = e as { status?: number; error?: { message?: string } };
      if (httpError.status === 0) {
        this.error.set('Sin conexión. No se pudo consultar el despacho.');
      } else if (httpError.status === 401) {
        this.error.set('Sesión expirada. Vuelve a iniciar sesión.');
      } else if (httpError.status === 403) {
        this.error.set('No tienes permiso de despachador.');
      } else {
        this.error.set(httpError.error?.message ?? 'Error al consultar evaluaciones.');
      }
    } finally {
      this.consultando.set(false);
      this.consultado.set(true);
    }
  }
}