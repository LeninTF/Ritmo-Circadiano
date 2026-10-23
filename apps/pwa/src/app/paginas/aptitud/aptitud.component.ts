import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColorSemaforo } from '@circadiano/contracts';
import { SemaforoAptitudComponent } from '../../compartido/semaforo-aptitud/semaforo-aptitud.component';
import { TarjetaComponent } from '../../compartido/tarjeta/tarjeta.component';
import { ESTILOS_FORMULARIO } from '../../auth/estilos-formulario';
import { AptitudService } from './aptitud.service';
import { SesionService } from '../../auth/sesion.service';

interface Paso {
  id: 'datos' | 'autorreporte' | 'resultado';
  titulo: string;
  completado: boolean;
}

const PASOS: Paso[] = [
  { id: 'datos', titulo: 'Datos', completado: false },
  { id: 'autorreporte', titulo: 'Autorreporte', completado: false },
  { id: 'resultado', titulo: 'Resultado', completado: false },
];

@Component({
  selector: 'app-aptitud',
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
  templateUrl: './aptitud.component.html',
})
export class AptitudComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly aptitudService = inject(AptitudService);
  private readonly sesion = inject(SesionService);
  private readonly router = inject(Router);

  protected readonly pasos = signal<Paso[]>(PASOS);
  protected readonly pasoActual = signal<'datos' | 'autorreporte' | 'resultado'>('datos');
  protected readonly cargandoDatos = signal(true);
  protected readonly horasSueno24h = signal<number | null>(null);
  protected readonly enviando = signal(false);
  protected readonly errorEnvio = signal<string | null>(null);
  protected readonly resultadoColor = signal<ColorSemaforo | null>(null);
  protected readonly motivos = signal<readonly string[]>([]);

  protected readonly formulario = this.fb.group({
    somnolencia: [null as number | null, [Validators.required, Validators.min(1), Validators.max(5)]],
    compartido: [false],
  });

  protected readonly nivelesSomnolencia = [
    { valor: 1, etiqueta: '1\nMuy vigilante' },
    { valor: 2, etiqueta: '2\nVigilante' },
    { valor: 3, etiqueta: '3\nNeutral' },
    { valor: 4, etiqueta: '4\nSomnoliento' },
    { valor: 5, etiqueta: '5\nMuy somnoliento' },
  ];

  constructor() {
    this.cargarDatosSueno();
  }

  private async cargarDatosSueno(): Promise<void> {
    this.cargandoDatos.set(true);
    try {
      // TODO: Integrar con el servicio real de registro de sueño cuando exista el endpoint
      // (p. ej. GET /diario?ultimas=24h o GET /sync/lote)
      // Cuando el endpoint esté disponible, aquí se consultarían
      // los registros de las últimas 24h y se calcularían las horas.
      // Mientras tanto, null indica "no disponible" y NO se interpreta como 0 horas.
      this.horasSueno24h.set(null);
    } catch {
      this.horasSueno24h.set(null);
    } finally {
      this.cargandoDatos.set(false);
    }
  }

  protected indicePaso(id: Paso['id']): number {
    return this.pasos().findIndex((p) => p.id === id);
  }

  protected puedeAvanzarAPaso(id: Paso['id']): boolean {
    const actualIdx = this.indicePaso(this.pasoActual());
    const objetivoIdx = this.indicePaso(id);
    return objetivoIdx <= actualIdx + 1 && this.pasos()[objetivoIdx - 1]?.completado;
  }

  protected irAPaso(id: Paso['id']): void {
    if (this.puedeAvanzarAPaso(id)) {
      this.pasoActual.set(id);
    }
  }

  protected siguientePaso(): void {
    const idx = this.indicePaso(this.pasoActual());
    if (idx < this.pasos().length - 1) {
      this.pasos.update((p) => p.map((paso, i) => (i === idx ? { ...paso, completado: true } : paso)));
      this.pasoActual.set(this.pasos()[idx + 1].id);
    }
  }

  protected async enviarAutoevaluacion(): Promise<void> {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const turnoId = this.obtenerTurnoIdDelDia();
    if (!turnoId) {
      this.errorEnvio.set('No hay un turno activo para hoy. Contacta con el despachador o consulta la pestaña «Turnos».');
      return;
    }

    this.enviando.set(true);
    this.errorEnvio.set(null);

    const somnolencia = this.formulario.controls.somnolencia.value;
    if (somnolencia === null) {
      this.enviando.set(false);
      return;
    }
    const compartido = this.formulario.value.compartido ?? false;

    try {
      const respuesta = await this.aptitudService
        .crearAptitud(turnoId, { somnolencia, compartido })
        .toPromise();

      if (respuesta?.color) {
        this.resultadoColor.set(respuesta.color);
        this.calcularMotivos(respuesta.color, somnolencia, this.horasSueno24h());
        this.pasos.update((p) =>
          p.map((paso) => (paso.id === 'autorreporte' ? { ...paso, completado: true } : paso))
        );
        this.pasoActual.set('resultado');
      }
    } catch (e: unknown) {
      const httpError = e as { status?: number; error?: { message?: string } };
      if (httpError.status === 0) {
        this.errorEnvio.set('No hay conexión. La evaluación no se envió. Intenta de nuevo cuando haya conexión.');
        // Sincronización offline pendiente: requiere endpoint /operaciones/turnos/me y persistencia segura
        // No se almacena en localStorage sin requisito explícito de privacidad y consentimiento.
      } else if (httpError.status === 401) {
        this.errorEnvio.set('Tu sesión ha expirado. Inicia sesión de nuevo.');
        this.sesion.cerrar();
        void this.router.navigate(['/ingresar'], { queryParams: { retorno: '/aptitud' } });
      } else if (httpError.status === 403) {
        this.errorEnvio.set('No tienes permiso para evaluar este turno.');
      } else if (httpError.status === 409) {
        this.errorEnvio.set('Ya existe una evaluación para este turno.');
      } else {
        this.errorEnvio.set(httpError.error?.message ?? 'Error al enviar la evaluación. Intenta de nuevo.');
      }
    } finally {
      this.enviando.set(false);
    }
  }

  /**
   * Obtiene el ID del turno activo del día actual.
   * TODO: Cuando exista el endpoint /operaciones/turnos/me (o similar),
   * esta función debe consultar el turno del día y devolver su ID real.
   * Mientras tanto, devuelve null para impedir envíos con identificadores ficticios.
   */
  protected obtenerTurnoIdDelDia(): string | null {
    // Integración pendiente: obtener el turno activo del usuario autenticado.
    // Ejemplo futuro:
    // const turno = await this.turnoService.obtenerTurnoActivo().toPromise();
    // return turno?.id ?? null;
    return null;
  }

  private calcularMotivos(color: ColorSemaforo, somnolencia: number, horasSueno: number | null): void {
    const motivos: string[] = [];
    if (color === 'rojo') {
      if (horasSueno !== null && horasSueno < 5) motivos.push('sueno_insuficiente');
      if (somnolencia >= 4) motivos.push('somnolencia_elevada');
    } else if (color === 'ambar') {
      motivos.push('sueno_intermedio');
    } else if (color === 'verde') {
      motivos.push('sueno_suficiente');
    }
    this.motivos.set(motivos);
  }

  protected traducirMotivo(motivo: string): string {
    const mapa: Record<string, string> = {
      sueno_insuficiente: 'Sueño insuficiente (< 5 h en las últimas 24 h)',
      somnolencia_elevada: 'Somnolencia autorreportada alta (≥ 4/5)',
      sueno_intermedio: 'Sueño intermedio (5–7 h en las últimas 24 h)',
      sueno_suficiente: 'Sueño suficiente (≥ 7 h en las últimas 24 h)',
    };
    return mapa[motivo] ?? motivo;
  }

  protected reiniciar(): void {
    this.formulario.reset({ somnolencia: null, compartido: false });
    this.pasos.set(PASOS);
    this.pasoActual.set('datos');
    this.resultadoColor.set(null);
    this.motivos.set([]);
    this.errorEnvio.set(null);
    this.cargarDatosSueno();
  }

}
