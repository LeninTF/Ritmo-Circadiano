import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { leerClaveMigrada } from './core/migrar-clave-local';

type Tema = 'claro' | 'oscuro';
type PreferenciaTema = Tema | 'automatico';

const CLAVE_TEMA = 'circaruta-tema';
const CLAVE_TEMA_ANTERIOR = 'gestor-circadiano-tema';
const HORA_INICIO_NOCTURNO = 22;
const HORA_FIN_NOCTURNO = 6;
const INTERVALO_ACTUALIZACION_MS = 60_000;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  private readonly documento = inject(DOCUMENT);
  private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));
  private temporizador?: ReturnType<typeof setInterval>;
  private consultaEsquema?: MediaQueryList;
  private preferenciaTema: PreferenciaTema = 'automatico';

  protected readonly temaActual = signal<Tema>('claro');

  protected readonly enlaces = [
    { ruta: '/plan', texto: 'Hoy', icono: 'hoy' },
    { ruta: '/cafeina', texto: 'Cafeína', icono: 'cafeina' },
    { ruta: '/aptitud', texto: 'Pre-salida', icono: 'presalida' },
    { ruta: '/diario', texto: 'Diario', icono: 'diario' },
  ];

  ngOnInit(): void {
    if (!this.esNavegador) return;

    this.preferenciaTema = this.leerPreferencia();
    const matchMedia = this.documento.defaultView?.matchMedia;
    this.consultaEsquema = typeof matchMedia === 'function'
      ? matchMedia.call(this.documento.defaultView, '(prefers-color-scheme: dark)')
      : undefined;
    this.consultaEsquema?.addEventListener('change', this.alCambiarEsquema);
    this.actualizarTema();
    this.temporizador = setInterval(
      () => this.actualizarTema(),
      INTERVALO_ACTUALIZACION_MS,
    );
  }

  ngOnDestroy(): void {
    if (this.temporizador !== undefined) clearInterval(this.temporizador);
    this.consultaEsquema?.removeEventListener('change', this.alCambiarEsquema);
  }

  protected cambiarTema(): void {
    this.preferenciaTema = this.preferenciaTema === 'oscuro' ? 'claro' : 'oscuro';
    try {
      this.documento.defaultView?.localStorage.setItem(CLAVE_TEMA, this.preferenciaTema);
    } catch {
      // El modo elegido se aplica aunque el navegador bloquee el almacenamiento local.
    }
    this.actualizarTema();
  }

  private readonly alCambiarEsquema = (): void => {
    if (this.preferenciaTema === 'automatico') this.actualizarTema();
  };

  private leerPreferencia(): PreferenciaTema {
    try {
      const almacen = this.documento.defaultView?.localStorage;
      const guardada = almacen && leerClaveMigrada(almacen, CLAVE_TEMA, CLAVE_TEMA_ANTERIOR);
      return guardada === 'claro' || guardada === 'oscuro' ? guardada : 'automatico';
    } catch {
      return 'automatico';
    }
  }

  private actualizarTema(): void {
    const hora = new Date().getHours();
    const esHorarioNocturno = hora >= HORA_INICIO_NOCTURNO || hora < HORA_FIN_NOCTURNO;
    const temaAutomatico: Tema = esHorarioNocturno || this.consultaEsquema?.matches
      ? 'oscuro'
      : 'claro';
    const tema = this.preferenciaTema === 'automatico' ? temaAutomatico : this.preferenciaTema;
    this.temaActual.set(tema);
    // Los tokens viven en :root (styles.scss): el atributo va en <html>, no en <app-root>.
    this.documento.documentElement.setAttribute('data-tema', tema);
  }
}
