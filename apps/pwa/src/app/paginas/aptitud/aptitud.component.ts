import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import type { CrearAptitudResponse, MotivoAptitud } from '@circadiano/contracts';
import type { TurnoLaboral } from '@circadiano/domain';
import { SemaforoAptitudComponent } from '../../compartido/semaforo-aptitud/semaforo-aptitud.component';
import { TarjetaComponent } from '../../compartido/tarjeta/tarjeta.component';
import { ESTILOS_FORMULARIO } from '../../auth/estilos-formulario';
import { AptitudService } from './aptitud.service';

type IdPaso = 'datos' | 'autorreporte' | 'resultado';

interface Paso {
  id: IdPaso;
  titulo: string;
  completado: boolean;
}

const PASOS: Paso[] = [
  { id: 'datos', titulo: 'Datos', completado: false },
  { id: 'autorreporte', titulo: 'Autorreporte', completado: false },
  { id: 'resultado', titulo: 'Resultado', completado: false },
];

const TEXTO_MOTIVO: Record<MotivoAptitud, string> = {
  sueno_insuficiente: 'Dormiste menos de 5 h en las últimas 24 h.',
  somnolencia_elevada: 'Marcaste mucho sueño ahora (4 o 5 de 5).',
  sueno_intermedio: 'Dormiste entre 5 y 7 h en las últimas 24 h.',
  sueno_suficiente: 'Dormiste 7 h o más en las últimas 24 h.',
};

// El 401 lo resuelve el authInterceptor (renueva o cierra la sesión).
const MENSAJE_POR_ESTADO: Record<number, string> = {
  0: 'No hay conexión. Inténtalo de nuevo cuando tengas señal.',
  403: 'Este turno no está asignado a ti.',
  404: 'El turno ya no existe. Vuelve a empezar.',
};

const mensajeError = (error: unknown, porDefecto: string): string =>
  (error instanceof HttpErrorResponse && MENSAJE_POR_ESTADO[error.status]) || porDefecto;

/** RF12: autoevaluación pre-salida en 3 pasos. El color lo calcula la API (RN09). */
@Component({
  selector: 'app-aptitud',
  imports: [DatePipe, ReactiveFormsModule, RouterLink, SemaforoAptitudComponent, TarjetaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    ESTILOS_FORMULARIO,
    `
      .pagina { display: grid; gap: 14px; }
      h2 { margin: 0 0 8px; font-size: 0.875rem; font-weight: 600; color: var(--color-texto); }
      .stepper { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .paso {
        display: flex; align-items: center; justify-content: center; gap: 6px; min-height: 44px;
        font: inherit; font-size: 0.75rem; color: var(--color-texto-2); background: var(--color-superficie-2);
        border: 1px solid var(--color-borde); border-radius: var(--radio-chip);
      }
      .paso.activo { color: var(--color-primario); background: var(--color-primario-fondo); border-color: var(--color-primario); font-weight: 600; }
      .paso.completado { color: var(--color-ok); }
      .aviso-rn11 { font-size: 0.75rem; color: var(--color-texto-2); }
      .dato { margin: 0 0 12px; font-size: 1.25rem; font-weight: 700; color: var(--color-texto); }
      .slider { width: 100%; min-height: 44px; accent-color: var(--color-primario); }
      .slider-etiquetas { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; text-align: center; }
      .slider-etiquetas span { display: grid; font-size: 0.6875rem; color: var(--color-texto-2); }
      .slider-etiquetas span.activo { color: var(--color-primario); font-weight: 600; }
      .eleccion { margin: 8px 0 0; font-size: 0.8125rem; color: var(--color-texto); font-weight: 600; }
      .motivos { margin: 12px 0; padding-left: 18px; font-size: 0.8125rem; color: var(--color-texto); }
      .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    `,
  ],
  templateUrl: './aptitud.component.html',
})
export class AptitudComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly aptitudService = inject(AptitudService);

  protected readonly pasos = signal<Paso[]>(PASOS);
  protected readonly pasoActual = signal<IdPaso>('datos');
  protected readonly cargandoTurno = signal(true);
  protected readonly turno = signal<TurnoLaboral | null>(null);
  protected readonly errorTurno = signal<string | null>(null);
  protected readonly enviando = signal(false);
  protected readonly errorEnvio = signal<string | null>(null);
  protected readonly resultado = signal<CrearAptitudResponse | null>(null);

  protected readonly formulario = this.fb.group({
    // null hasta que el trabajador elija: el slider no propone un valor por defecto.
    somnolencia: [null as number | null, [Validators.required, Validators.min(1), Validators.max(5)]],
    compartido: [false],
  });

  protected readonly nivelesSomnolencia = [
    { valor: 1, etiqueta: 'Muy alerta' },
    { valor: 2, etiqueta: 'Alerta' },
    { valor: 3, etiqueta: 'Normal' },
    { valor: 4, etiqueta: 'Con sueño' },
    { valor: 5, etiqueta: 'Mucho sueño' },
  ];

  constructor() {
    void this.cargarTurno();
  }

  private async cargarTurno(): Promise<void> {
    this.cargandoTurno.set(true);
    this.errorTurno.set(null);
    try {
      this.turno.set(await firstValueFrom(this.aptitudService.obtenerTurnoParaEvaluar()));
    } catch (e: unknown) {
      this.turno.set(null);
      this.errorTurno.set(mensajeError(e, 'No se pudo cargar tu turno. Inténtalo de nuevo.'));
    } finally {
      this.cargandoTurno.set(false);
    }
  }

  protected indicePaso(id: IdPaso): number {
    return this.pasos().findIndex((p) => p.id === id);
  }

  protected puedeAvanzarAPaso(id: IdPaso): boolean {
    const objetivo = this.indicePaso(id);
    if (objetivo === 0) return true;
    return objetivo <= this.indicePaso(this.pasoActual()) + 1 && this.pasos()[objetivo - 1].completado;
  }

  protected irAPaso(id: IdPaso): void {
    if (this.puedeAvanzarAPaso(id)) this.pasoActual.set(id);
  }

  protected siguientePaso(): void {
    const idx = this.indicePaso(this.pasoActual());
    if (idx < this.pasos().length - 1) {
      this.pasos.update((p) => p.map((paso, i) => (i === idx ? { ...paso, completado: true } : paso)));
      this.pasoActual.set(this.pasos()[idx + 1].id);
    }
  }

  /** El clic o Enter/Espacio sobre el slider confirma también el valor en el que ya está. */
  protected elegirSomnolencia(slider: HTMLInputElement): void {
    this.formulario.controls.somnolencia.setValue(slider.valueAsNumber);
  }

  protected etiquetaSomnolencia(valor: number | null): string {
    const nivel = this.nivelesSomnolencia.find((n) => n.valor === valor);
    return nivel ? `${nivel.valor} de 5: ${nivel.etiqueta}` : 'Sin elegir';
  }

  protected async enviarAutoevaluacion(): Promise<void> {
    const turno = this.turno();
    const somnolencia = this.formulario.controls.somnolencia.value;
    if (!turno || somnolencia === null || this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.errorEnvio.set(null);
    try {
      const respuesta = await firstValueFrom(
        this.aptitudService.crearAptitud(turno.id, {
          somnolencia,
          compartido: this.formulario.controls.compartido.value,
        }),
      );
      this.resultado.set(respuesta);
      this.siguientePaso();
    } catch (e: unknown) {
      this.errorEnvio.set(mensajeError(e, 'No se pudo enviar la evaluación. Inténtalo de nuevo.'));
    } finally {
      this.enviando.set(false);
    }
  }

  protected textoMotivo(motivo: MotivoAptitud): string {
    return TEXTO_MOTIVO[motivo];
  }

  /** La API ya redondea a 0,1 h; solo se cambia el separador decimal. */
  protected formatearHoras(horas: number): string {
    return String(horas).replace('.', ',');
  }

  protected reiniciar(): void {
    this.formulario.reset();
    this.pasos.set(PASOS);
    this.pasoActual.set('datos');
    this.resultado.set(null);
    this.errorEnvio.set(null);
    void this.cargarTurno();
  }
}
