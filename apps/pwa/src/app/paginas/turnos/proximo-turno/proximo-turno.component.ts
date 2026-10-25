import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TurnoLaboral } from '@circadiano/domain';
import { TarjetaComponent } from '../../../compartido/tarjeta/tarjeta.component';
import { ProximoTurnoService } from './proximo-turno.service';
import { EstadoVistaTurno } from './proximo-turno.models';

@Component({
  selector: 'app-proximo-turno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TarjetaComponent],
  templateUrl: './proximo-turno.component.html',
  styleUrl: './proximo-turno.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProximoTurnoComponent implements OnInit {
  private readonly turnoService = inject(ProximoTurnoService);
  private readonly fb = inject(FormBuilder);

  readonly idTurno = input<string | null>(null);

  readonly estadoVista = signal<EstadoVistaTurno>('cargando');
  readonly turno = signal<TurnoLaboral | null>(null);
  readonly guardando = signal<boolean>(false);
  readonly modoCorreccion = signal<boolean>(false);
  readonly solicitandoConfirmacionCorreccion = signal<boolean>(false);
  readonly mensajeExito = signal<string | null>(null);
  readonly mensajeError = signal<string | null>(null);

  readonly formCorreccion: FormGroup = this.fb.group({
    horaInicio: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):[0-5]\d$/)]],
    horaFin: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):[0-5]\d$/)]],
    cruzaMedianoche: [false],
  });

  ngOnInit(): void {
    this.cargarTurno();
  }

  cargarTurno(): void {
    this.estadoVista.set('cargando');
    this.mensajeError.set(null);

    this.turnoService.obtenerProximoTurno(this.idTurno()).subscribe({
      next: (t) => {
        if (!t) {
          this.turno.set(null);
          this.estadoVista.set('sin_turno');
          return;
        }
        this.turno.set(t);
        this.actualizarEstadoVistaSegunTurno(t);
      },
      error: () => {
        this.estadoVista.set('error');
        this.mensajeError.set('No se pudo cargar la información del próximo turno.');
      },
    });
  }

  confirmarTurnoDirecto(): void {
    const t = this.turno();
    if (!t || this.guardando()) return;

    this.guardando.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);

    this.turnoService
      .confirmarTurno(t.id, { estadoConfirmacion: 'confirmado' })
      .subscribe({
        next: (turnoActualizado) => {
          this.guardando.set(false);
          this.turno.set(turnoActualizado);
          this.estadoVista.set('confirmado');
          this.mensajeExito.set('Turno confirmado.');
        },
        error: (err: unknown) => {
          this.guardando.set(false);
          const msg =
            err instanceof Error
              ? err.message
              : 'Error al confirmar el turno. Inténtalo nuevamente.';
          this.mensajeError.set(msg);
        },
      });
  }

  abrirCorreccion(): void {
    const t = this.turno();
    if (!t) return;

    const inicioIso = t.horaInicioReal || t.inicioProgramado;
    const finIso = t.horaFinReal || t.finProgramado;
    const horaInicio = this.extraerHoraHHmm(inicioIso);
    const horaFin = this.extraerHoraHHmm(finIso);
    const cruzaMedianoche = t.esNocturno || this.cruzaMedianocheFechas(inicioIso, finIso);

    this.formCorreccion.reset({ horaInicio, horaFin, cruzaMedianoche });
    this.mensajeExito.set(null);
    this.mensajeError.set(null);
    this.solicitandoConfirmacionCorreccion.set(false);
    this.modoCorreccion.set(true);
  }

  cancelarCorreccion(): void {
    this.modoCorreccion.set(false);
    this.solicitandoConfirmacionCorreccion.set(false);
    this.mensajeError.set(null);
  }

  solicitarGuardarCorreccion(): void {
    if (this.formCorreccion.invalid) {
      this.formCorreccion.markAllAsTouched();
      this.mensajeError.set('Por favor ingresa horarios válidos en formato HH:mm (24 horas).');
      return;
    }

    const val = this.formCorreccion.value;
    const validacion = this.validarCoherenciaTemporal(
      val.horaInicio,
      val.horaFin,
      val.cruzaMedianoche,
    );

    if (!validacion.esValido) {
      this.mensajeError.set(validacion.mensaje);
      return;
    }

    this.mensajeError.set(null);
    this.solicitandoConfirmacionCorreccion.set(true);
  }

  regresarAEdicion(): void {
    this.solicitandoConfirmacionCorreccion.set(false);
  }

  ejecutarGuardarCorreccion(): void {
    const t = this.turno();
    if (!t || this.guardando()) return;

    const val = this.formCorreccion.value;
    const timestamps = this.construirTimestampsIso(
      t.fecha,
      val.horaInicio,
      val.horaFin,
      val.cruzaMedianoche,
    );

    this.guardando.set(true);
    this.mensajeError.set(null);

    this.turnoService
      .confirmarTurno(t.id, {
        estadoConfirmacion: 'corregido',
        horaInicioReal: timestamps.horaInicioRealIso,
        horaFinReal: timestamps.horaFinRealIso,
      })
      .subscribe({
        next: (turnoActualizado) => {
          this.guardando.set(false);
          this.turno.set(turnoActualizado);
          this.modoCorreccion.set(false);
          this.solicitandoConfirmacionCorreccion.set(false);
          this.estadoVista.set('corregido');
          this.mensajeExito.set('Horario real guardado. Tu plan se actualizará con estos datos.');
        },
        error: (err: unknown) => {
          this.guardando.set(false);
          const msg =
            err instanceof Error
              ? err.message
              : 'Error al guardar la corrección de horario. Inténtalo nuevamente.';
          this.mensajeError.set(msg);
        },
      });
  }

  private actualizarEstadoVistaSegunTurno(t: TurnoLaboral): void {
    if (t.estadoConfirmacion === 'confirmado') {
      this.estadoVista.set('confirmado');
    } else if (t.estadoConfirmacion === 'corregido') {
      this.estadoVista.set('corregido');
    } else {
      this.estadoVista.set('pendiente');
    }
  }

  extraerHoraHHmm(isoDateStr: string | null): string {
    if (!isoDateStr) return '';
    try {
      const d = new Date(isoDateStr);
      if (isNaN(d.getTime())) return '';
      // Hora local del dispositivo: la API guarda timestamps UTC.
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    } catch {
      return '';
    }
  }

  formatearFechaLegible(fechaIso: string): string {
    try {
      const d = new Date(fechaIso);
      if (isNaN(d.getTime())) return fechaIso;
      return d.toLocaleDateString('es-PE', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      });
    } catch {
      return fechaIso;
    }
  }

  private cruzaMedianocheFechas(inicioIso: string, finIso: string): boolean {
    try {
      const ini = new Date(inicioIso);
      const fin = new Date(finIso);
      return fin.getTime() - ini.getTime() > 0 && fin.getDate() !== ini.getDate();
    } catch {
      return false;
    }
  }

  validarCoherenciaTemporal(
    horaInicio: string,
    horaFin: string,
    cruzaMedianoche: boolean,
  ): { esValido: boolean; mensaje: string } {
    if (!horaInicio || !horaFin) {
      return { esValido: false, mensaje: 'Debes ingresar las horas de inicio y fin.' };
    }

    const [hIni, mIni] = horaInicio.split(':').map(Number);
    const [hFin, mFin] = horaFin.split(':').map(Number);

    const minutosIni = hIni * 60 + mIni;
    let minutosFin = hFin * 60 + mFin;

    if (cruzaMedianoche) {
      minutosFin += 24 * 60;
    }

    if (minutosFin <= minutosIni) {
      return {
        esValido: false,
        mensaje:
          'La hora de finalización debe ser posterior a la de inicio. Si termina al día siguiente, marca "Cruza medianoche (+1 día)".',
      };
    }

    const duracionMinutos = minutosFin - minutosIni;
    if (duracionMinutos < 30) {
      return { esValido: false, mensaje: 'La duración del turno no puede ser inferior a 30 minutos.' };
    }
    if (duracionMinutos > 24 * 60) {
      return { esValido: false, mensaje: 'La duración del turno no puede exceder las 24 horas.' };
    }

    return { esValido: true, mensaje: '' };
  }

  construirTimestampsIso(
    fechaBase: string,
    horaInicio: string,
    horaFin: string,
    cruzaMedianoche: boolean,
  ): { horaInicioRealIso: string; horaFinRealIso: string } {
    // `fecha` llega como día UTC (AAAA-MM-DD o medianoche UTC); las horas son locales del trabajador.
    const [anio, mes, dia] = fechaBase.slice(0, 10).split('-').map(Number);
    const enFecha = (hhmm: string, desfaseDias: number) => {
      const [h, m] = hhmm.split(':').map(Number);
      return new Date(anio, mes - 1, dia + desfaseDias, h, m).toISOString();
    };
    const horaInicioRealIso = enFecha(horaInicio, 0);
    const horaFinRealIso = enFecha(horaFin, cruzaMedianoche ? 1 : 0);

    return { horaInicioRealIso, horaFinRealIso };
  }
}
