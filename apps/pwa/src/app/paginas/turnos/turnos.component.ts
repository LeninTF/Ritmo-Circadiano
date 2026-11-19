import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { RutaDto, TrabajadorResumenDto, TurnoDto } from '@circadiano/contracts';
import { detectarTurnoNocturno } from '@circadiano/domain';
import { SesionService } from '../../auth/sesion.service';
import { fechaLima, horaLima } from '../cafeina/cafeina.service';
import { TurnosService } from './turnos.service';
import { rangoTurnoLima, semanaDe, sumarDias } from './turnos-fecha';

const NOMBRES_DIA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

/** Cuerpo del 409 de RN01 (operaciones.service.ts). */
interface ExcesoJornada {
  horasConduccionTurno?: number;
  limiteContinuoMax?: number;
  horasAcumuladas24h?: number;
  limiteVentanaMax?: number;
  superaContinuo?: boolean;
  superaVentana?: boolean;
}

@Component({
  selector: 'app-turnos',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .encabezado { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; }
    h1 { margin: 0; font-size: 1.5rem; line-height: 2rem; }
    .acciones, .semana { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
    .semana { justify-content: space-between; margin-block: 16px; }
    .semana span { font-variant-numeric: tabular-nums; font-weight: 600; }
    .boton {
      min-height: 44px; padding: 0 16px; font: inherit; font-weight: 600; cursor: pointer;
      color: var(--color-texto); background: var(--color-superficie-2);
      border: 1px solid var(--color-borde); border-radius: var(--radio-boton);
    }
    .boton--primario {
      min-height: var(--alto-boton-primario); width: 100%;
      color: var(--color-sobre-primario); background: var(--color-primario); border-color: var(--color-primario);
    }
    .boton:disabled { opacity: 0.6; cursor: not-allowed; }
    label { display: grid; gap: 4px; font-size: 0.875rem; font-weight: 500; color: var(--color-texto-2); }
    select, input, textarea {
      min-height: 44px; padding: 8px 12px; font: inherit; font-size: 1rem; color: var(--color-texto);
      background: var(--color-superficie); border: 1px solid var(--color-borde); border-radius: var(--radio-boton);
    }
    .filtro { margin-bottom: 16px; }
    .dias { display: grid; gap: 12px; }
    .dia { padding: 16px; background: var(--color-superficie); border: 1px solid var(--color-borde); border-radius: var(--radio-tarjeta); }
    .dia h2 { margin: 0 0 8px; font-size: 1rem; }
    .dia small { color: var(--color-texto-3); font-weight: 400; }
    .vacio { margin: 0; color: var(--color-texto-3); font-size: 0.875rem; }
    .turno { display: grid; gap: 4px; padding: 12px; margin-top: 8px; background: var(--color-superficie-2); border-radius: var(--radio-tile); }
    .turno__hora { font-size: 1.125rem; font-weight: 600; font-variant-numeric: tabular-nums; }
    .turno__meta { font-size: 0.875rem; color: var(--color-texto-2); }
    .chip { justify-self: start; padding: 2px 10px; font-size: 0.8125rem; color: var(--color-primario); background: var(--color-primario-fondo); border-radius: var(--radio-chip); }
    .aviso { padding: 12px 16px; margin-bottom: 16px; color: var(--color-alerta-texto); background: var(--color-alerta-fondo); border: 1px solid var(--color-alerta); border-radius: var(--radio-tile); }
    .error { color: var(--color-peligro-texto); font-size: 0.875rem; }
    .fondo { position: fixed; inset: 0; z-index: 20; display: flex; align-items: flex-end; justify-content: center; background: rgb(0 0 0 / 0.5); }
    .hoja {
      width: 100%; max-width: 480px; max-height: 92dvh; overflow-y: auto; padding: 20px 20px calc(20px + env(safe-area-inset-bottom));
      background: var(--color-superficie); border-radius: var(--radio-hoja) var(--radio-hoja) 0 0; box-shadow: var(--sombra-hoja);
    }
    .hoja h2 { margin: 0 0 16px; font-size: 1.125rem; }
    form { display: grid; gap: 12px; }
    .fila { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .check { display: flex; align-items: center; gap: 8px; min-height: 44px; color: var(--color-texto); }
    .check input { min-height: 0; width: 20px; height: 20px; }
  `,
  template: `
    <section class="pagina">
      @if (!enLinea()) {
        <p class="aviso" role="status">Sin conexión: se muestran los turnos guardados en este dispositivo.</p>
      }

      <div class="encabezado">
        <h1>Turnos</h1>
        <div class="acciones">
          <button class="boton" type="button" (click)="abrirNuevo()">+ Nuevo</button>
          <button class="boton" type="button" (click)="importando.set(!importando())">Importar</button>
        </div>
      </div>

      @if (importando()) {
        <div class="dia filtro">
          <label>Archivo CSV<input type="file" accept=".csv" (change)="elegirArchivo($event)" /></label>
          <button class="boton" type="button" [disabled]="!archivo()" (click)="importar()">Procesar</button>
          @if (resultadoImportacion()) { <p role="status">{{ resultadoImportacion() }}</p> }
        </div>
      }

      <div class="semana">
        <button class="boton" type="button" (click)="moverSemana(-1)" aria-label="Semana anterior">‹</button>
        <span>{{ dias()[0].fecha }} al {{ dias()[6].fecha }}</span>
        <button class="boton" type="button" (click)="moverSemana(1)" aria-label="Semana siguiente">›</button>
      </div>

      @if (esGestor()) {
        <label class="filtro">
          Trabajador
          <select [value]="filtroTrabajador()" (change)="filtrar($any($event.target).value)">
            <option value="">Todos</option>
            @for (t of trabajadores(); track t.id) {
              <option [value]="t.id">{{ etiquetaTrabajador(t) }}</option>
            }
          </select>
        </label>
      }

      <div class="dias">
        @for (d of dias(); track d.fecha) {
          <article class="dia">
            <h2>{{ d.nombre }} <small>{{ d.fecha }}</small></h2>
            @for (t of turnosDe(d.fecha); track t.id) {
              <div class="turno">
                <span class="turno__hora">{{ hora(t.inicioProgramado) }} – {{ hora(t.finProgramado) }}</span>
                <span class="turno__meta">
                  @if (esGestor()) { {{ codigoDe(t.idUsuario) }} · }
                  {{ t.ruta ? t.ruta.origen + ' – ' + t.ruta.destino : 'Ruta' }} · {{ t.horasConduccion }} h · {{ t.estadoConfirmacion }}
                </span>
                @if (t.esNocturno) { <span class="chip">Nocturno</span> }
                @if (esGestor()) {
                  <div class="acciones">
                    <button class="boton" type="button" (click)="editar(t)">Editar</button>
                    <button class="boton" type="button" (click)="eliminar(t.id)">Eliminar</button>
                  </div>
                }
              </div>
            } @empty {
              <p class="vacio">Sin turnos</p>
            }
          </article>
        }
      </div>

      @if (hojaAbierta()) {
        <div class="fondo" (click)="cerrarHoja()" (keydown.escape)="cerrarHoja()" tabindex="-1">
          <div class="hoja" role="dialog" aria-modal="true" aria-labelledby="titulo-turno" (click)="$event.stopPropagation()" (keydown)="$event.stopPropagation()" tabindex="-1">
            <h2 id="titulo-turno">{{ idEditando() ? 'Editar turno' : 'Nuevo turno' }}</h2>
            <form [formGroup]="form" (ngSubmit)="guardar()">
              <label>Trabajador
                <select formControlName="idUsuario">
                  <option value="">Elige un trabajador</option>
                  @for (t of trabajadores(); track t.id) { <option [value]="t.id">{{ etiquetaTrabajador(t) }}</option> }
                </select>
              </label>
              <label>Ruta
                <select formControlName="idRuta">
                  <option value="">Elige una ruta</option>
                  @for (r of rutas(); track r.id) { <option [value]="r.id">{{ r.origen }} – {{ r.destino }}</option> }
                </select>
              </label>
              <label>Fecha<input type="date" formControlName="fecha" /></label>
              <div class="fila">
                <label>Inicio (hora Lima)<input type="time" formControlName="horaInicio" /></label>
                <label>Fin (hora Lima)<input type="time" formControlName="horaFin" /></label>
              </div>
              <label>Horas de conducción continua<input type="number" step="0.5" min="0.5" formControlName="horasConduccion" /></label>

              @if (exceso(); as e) {
                <div class="aviso" role="alert">
                  <strong>El turno excede la jornada (RN01).</strong>
                  @if (e.superaContinuo) { <p>{{ e.horasConduccionTurno }} h continuas; el máximo es {{ e.limiteContinuoMax }} h.</p> }
                  @if (e.superaVentana) { <p>Suma {{ e.horasAcumuladas24h }} h de conducción en 24 h; el máximo es {{ e.limiteVentanaMax }} h.</p> }
                  <label>Motivo (obligatorio)<textarea formControlName="motivoExceso" rows="2"></textarea></label>
                  <label class="check"><input type="checkbox" formControlName="confirmarExceso" /> Confirmo asignar el turno con exceso</label>
                </div>
              }
              @if (error()) { <p class="error" role="alert">{{ error() }}</p> }

              <button class="boton boton--primario" type="submit" [disabled]="form.invalid || !excesoListo()">
                {{ exceso() ? 'Asignar con exceso' : 'Guardar' }}
              </button>
              <button class="boton" type="button" (click)="cerrarHoja()">Cancelar</button>
            </form>
          </div>
        </div>
      }
    </section>
  `,
})
export class TurnosComponent implements OnInit {
  private readonly svc = inject(TurnosService);
  private readonly sesion = inject(SesionService);
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly esGestor = computed(() => this.sesion.rol() !== 'trabajador');
  protected readonly enLinea = signal(navigator.onLine);
  protected readonly rutas = signal<RutaDto[]>([]);
  protected readonly trabajadores = signal<TrabajadorResumenDto[]>([]);
  protected readonly turnos = signal<TurnoDto[]>([]);
  protected readonly filtroTrabajador = signal('');
  private readonly fechaBase = signal(fechaLima(new Date().toISOString()));
  protected readonly dias = computed(() =>
    semanaDe(this.fechaBase()).map((fecha, i) => ({ fecha, nombre: NOMBRES_DIA[i] })),
  );

  protected readonly importando = signal(false);
  protected readonly archivo = signal<File | null>(null);
  protected readonly resultadoImportacion = signal('');
  protected readonly hojaAbierta = signal(false);
  protected readonly idEditando = signal<string | null>(null);
  protected readonly exceso = signal<ExcesoJornada | null>(null);
  protected readonly error = signal('');

  protected readonly form = this.fb.group({
    idUsuario: ['', Validators.required],
    idRuta: ['', Validators.required],
    fecha: ['', Validators.required],
    horaInicio: ['', Validators.required],
    horaFin: ['', Validators.required],
    horasConduccion: [4, [Validators.required, Validators.min(0.5)]],
    motivoExceso: [''],
    confirmarExceso: [false],
  });
  private readonly valoresForm = signal(this.form.getRawValue());
  /** Con exceso, se exige marcar la confirmación y escribir el motivo (RF14). */
  protected readonly excesoListo = computed(() => {
    const v = this.valoresForm();
    return !this.exceso() || (v.confirmarExceso && v.motivoExceso.trim().length > 0);
  });

  constructor() {
    window.addEventListener('online', () => this.enLinea.set(true));
    window.addEventListener('offline', () => this.enLinea.set(false));
    this.form.valueChanges.subscribe(() => this.valoresForm.set(this.form.getRawValue()));
  }

  ngOnInit(): void {
    if (this.esGestor()) {
      this.svc.listarRutas().subscribe((r) => this.rutas.set(r));
      this.svc.listarTrabajadores().subscribe({ next: (t) => this.trabajadores.set(t), error: () => this.trabajadores.set([]) });
    }
    this.cargar();
  }

  protected hora = horaLima;

  protected turnosDe(fecha: string): TurnoDto[] {
    return this.turnos().filter((t) => t.fecha.slice(0, 10) === fecha);
  }

  protected etiquetaTrabajador(t: TrabajadorResumenDto): string {
    return t.cargo ? `${t.codigoParticipante} · ${t.cargo}` : t.codigoParticipante;
  }

  protected codigoDe(idUsuario: string): string {
    return this.trabajadores().find((t) => t.id === idUsuario)?.codigoParticipante ?? 'Trabajador';
  }

  protected moverSemana(direccion: number): void {
    this.fechaBase.set(sumarDias(this.fechaBase(), direccion * 7));
    this.cargar();
  }

  protected filtrar(idUsuario: string): void {
    this.filtroTrabajador.set(idUsuario);
    this.cargar();
  }

  private cargar(): void {
    const desde = this.dias()[0].fecha;
    const hasta = this.dias()[6].fecha;
    const consulta = this.esGestor()
      ? this.svc.listarTurnos(this.filtroTrabajador() || undefined, desde, hasta)
      : this.svc.listarTurnosMe(desde, hasta);
    consulta.subscribe({ next: (t) => this.turnos.set(t), error: () => this.turnos.set([]) });
  }

  protected elegirArchivo(e: Event): void {
    this.archivo.set((e.target as HTMLInputElement).files?.[0] ?? null);
  }

  protected importar(): void {
    const archivo = this.archivo();
    if (!archivo) return;
    this.svc.importarTurnos(archivo).subscribe({
      next: (r) => {
        this.resultadoImportacion.set(`${r.importados} turnos importados, ${r.errores.length} con error.`);
        this.cargar();
      },
      error: () => this.resultadoImportacion.set('No se pudo importar el archivo.'),
    });
  }

  protected abrirNuevo(): void {
    this.idEditando.set(null);
    this.form.reset({ idUsuario: this.filtroTrabajador(), fecha: this.fechaBase(), horaInicio: '08:00', horaFin: '12:00', horasConduccion: 4 });
    this.abrirHoja();
  }

  protected editar(t: TurnoDto): void {
    this.idEditando.set(t.id);
    this.form.reset({
      idUsuario: t.idUsuario,
      idRuta: t.idRuta,
      fecha: t.fecha.slice(0, 10),
      horaInicio: horaLima(t.inicioProgramado),
      horaFin: horaLima(t.finProgramado),
      horasConduccion: Number(t.horasConduccion),
    });
    this.abrirHoja();
  }

  private abrirHoja(): void {
    this.exceso.set(null);
    this.error.set('');
    this.hojaAbierta.set(true);
  }

  protected cerrarHoja(): void {
    this.hojaAbierta.set(false);
  }

  protected guardar(): void {
    if (this.form.invalid || !this.excesoListo()) return;
    const v = this.form.getRawValue();
    const { inicio, fin } = rangoTurnoLima(v.fecha, v.horaInicio, v.horaFin);
    const dto = {
      idUsuario: v.idUsuario,
      idRuta: v.idRuta,
      fecha: v.fecha,
      inicioProgramado: inicio,
      finProgramado: fin,
      horasConduccion: Number(v.horasConduccion),
      esNocturno: detectarTurnoNocturno(inicio, fin),
      ...(this.exceso() ? { confirmarExceso: true, motivoExceso: v.motivoExceso.trim() } : {}),
    };
    const id = this.idEditando();
    (id ? this.svc.actualizarTurno(id, dto) : this.svc.crearTurno(dto)).subscribe({
      next: () => {
        this.cerrarHoja();
        this.cargar();
      },
      error: (e: HttpErrorResponse) => {
        if (e.status === 409 && e.error?.requiereConfirmacion) {
          this.exceso.set(e.error as ExcesoJornada);
          this.error.set('');
        } else {
          this.error.set(e.status === 400 ? 'Revisa los datos del turno.' : 'No se pudo guardar el turno.');
        }
      },
    });
  }

  protected eliminar(id: string): void {
    if (confirm('¿Eliminar este turno?')) this.svc.eliminarTurno(id).subscribe(() => this.cargar());
  }
}
