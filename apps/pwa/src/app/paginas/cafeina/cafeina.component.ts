import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwPush } from '@angular/service-worker';
import { calcularHoraCorte, residual, UMBRAL_CAFEINA_MG_DEFECTO, SEMIVIDA_H_DEFECTO } from '@circadiano/domain';

interface IngestaItem {
  client_id: string;
  nombre_bebida: string;
  miligramos: number;
  fecha_hora: string;
  residual_estimado_mg?: number;
  sincronizado: boolean;
}

@Component({
  selector: 'app-cafeina',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="cafeina-container" aria-label="Gestión de Ingesta y Farmacocinética de Cafeína">
      <header class="header-card">
        <h1>Gestión de Cafeína y Farmacocinética (RF08 / RF09)</h1>
        <p>Controla tu consumo de cafeína, calcula tu hora límite de corte y recibe alertas preventivas para proteger tu ritmo circadiano.</p>
      </header>

      @if (mostrarBannerIos()) {
        <div class="banner-ios" role="region" aria-label="Instrucciones para instalar en iOS">
          <span>📱 Para instalar esta PWA en tu iPhone/iPad: Toca el botón <strong>Compartir</strong> y selecciona <strong>"Agregar a pantalla de inicio"</strong>.</span>
          <button (click)="cerrarBannerIos()" aria-label="Cerrar banner de instalación">Entendido</button>
        </div>
      }

      @if (residualEstimadoBedtime() > umbralCafeina) {
        <div class="alerta-umbral" role="alert">
          <h2>⚠️ Alerta de Exceso de Cafeína</h2>
          <p>Tu residual estimado al acostarte (<strong>{{ residualEstimadoBedtime().toFixed(1) }} mg</strong>) supera el umbral seguro de {{ umbralCafeina }} mg.</p>
          <p class="sugerencia"><strong>Alternativa recomendada sin cafeína:</strong> Infusiones de manzanilla, agua purificada o té de hierbas sin teína.</p>
        </div>
      }

      <div class="grid-dashboard">
        <section class="card" aria-labelledby="titulo-registro">
          <h2 id="titulo-registro">Registro Rápido de Ingesta</h2>
          <div class="botones-catalogo" role="group" aria-label="Bebidas del catálogo">
            @for (bebida of catalogoBebidas; track bebida.nombre) {
              <button 
                type="button" 
                class="btn-bebida"
                (click)="seleccionarBebida(bebida)"
                [attr.aria-label]="'Registrar ' + bebida.nombre + ' con ' + bebida.mg + ' miligramos'">
                <span>☕ {{ bebida.nombre }}</span>
                <span class="mg-badge">{{ bebida.mg }} mg</span>
              </button>
            }
          </div>
          <form (submit)="registrarIngesta($event)" class="form-ingesta">
            <div class="form-group">
              <label for="nombreBebida">Bebida / Personalizada:</label>
              <input id="nombreBebida" type="text" [(ngModel)]="nuevaIngesta.nombre_bebida" name="nombreBebida" required placeholder="Ej. Café pasado" />
            </div>

            <div class="form-group">
              <label for="miligramos">Miligramos (mg):</label>
              <input id="miligramos" type="number" [(ngModel)]="nuevaIngesta.miligramos" name="miligramos" min="1" max="1000" required />
            </div>

            <div class="form-group">
              <label for="fechaHora">Fecha y Hora:</label>
              <input id="fechaHora" type="datetime-local" [(ngModel)]="nuevaIngesta.fecha_hora" name="fechaHora" required />
            </div>

            <button type="submit" class="btn-primary" aria-label="Guardar registro de cafeína">
              {{ onlineStatus() ? 'Registrar Ingesta' : 'Guardar Local (Offline)' }}
            </button>
          </form>

          @if (!onlineStatus()) {
            <p class="offline-badge" role="status">📡 Estás offline. Las ingestas se guardan en la cola local Outbox y se sincronizarán al recuperar la red.</p>
          }
        </section>

        <section class="card" aria-labelledby="titulo-farmaco">
          <h2 id="titulo-farmaco">Análisis Farmacocinético (RF09)</h2>
          <div class="metricas-box">
            <div class="metrica">
              <span class="label">Hora de Corte Personalizada:</span>
              <span class="valor highlight">{{ horaCorteCalculada() }}</span>
            </div>
            <div class="metrica">
              <span class="label">Residual al Dormir (23:00):</span>
              <span class="valor" [class.exceso]="residualEstimadoBedtime() > umbralCafeina">
                {{ residualEstimadoBedtime().toFixed(1) }} mg
              </span>
            </div>
            <div class="metrica">
              <span class="label">Umbral de Seguridad (RN02):</span>
              <span class="valor">{{ umbralCafeina }} mg</span>
            </div>
          </div>

          <div class="push-section">
            <h3>Notificaciones Web Push (RF10)</h3>
            <p>Activa las alertas preventivas para recibir avisos de corte de cafeína y descanso.</p>
            <button type="button" class="btn-secondary" (click)="suscribirPush()" aria-label="Activar notificaciones push">
              Activar Alertas Push
            </button>
          </div>
        </section>
      </div>

      <section class="card historial-card" aria-labelledby="titulo-historial">
        <h2 id="titulo-historial">Ingestas Registradas Hoy</h2>
        @if (listaIngestas().length === 0) {
          <p class="vacio">No hay ingestas de cafeína registradas para hoy.</p>
        } @else {
          <ul class="lista-ingestas" role="list">
            @for (ing of listaIngestas(); track ing.client_id) {
              <li class="ingesta-item">
                <div class="info">
                  <strong>{{ ing.nombre_bebida }}</strong>
                  <span>{{ ing.miligramos }} mg - {{ formatFecha(ing.fecha_hora) }}</span>
                </div>
                <div class="estado-sinc">
                  @if (ing.sincronizado) {
                    <span class="badge sincronizado" aria-label="Sincronizado con el servidor">✓ Sincronizado</span>
                  } @else {
                    <span class="badge pendiente" aria-label="Pendiente de sincronización local">⏳ Pendiente Offline</span>
                  }
                  <button type="button" class="btn-eliminar" (click)="eliminarIngesta(ing.client_id)" aria-label="Eliminar ingesta">×</button>
                </div>
              </li>
            }
          </ul>
        }
      </section>
    </main>
  `,

  styles: [`
    .cafeina-container { max-width: 1200px; margin: 0 auto; padding: 1.5rem; font-family: system-ui, -apple-system, sans-serif; color: #1f2937; background-color: #f9fafb; min-height: 100vh; }
    .header-card { background: #ffffff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 1.5rem; }
    .header-card h1 { font-size: 1.75rem; color: #1e3a8a; margin-bottom: 0.5rem; }
    .banner-ios { background: #eff6ff; border: 1px solid #bfdbfe; padding: 1rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .banner-ios button { background: #2563eb; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; }
    .alerta-umbral { background: #fef2f2; border: 2px solid #ef4444; padding: 1.25rem; border-radius: 12px; margin-bottom: 1.5rem; color: #991b1b; }
    .alerta-umbral h2 { margin-top: 0; font-size: 1.25rem; }
    .sugerencia { margin-top: 0.5rem; font-size: 0.95rem; color: #7f1d1d; }
    .grid-dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem; }
    .card { background: #ffffff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card h2 { font-size: 1.25rem; color: #1f2937; margin-top: 0; margin-bottom: 1rem; }
    .botones-catalogo { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1.25rem; }
    .btn-bebida { background: #f3f4f6; border: 1px solid #d1d5db; padding: 0.75rem; border-radius: 8px; cursor: pointer; display: flex; flex-direction: column; align-items: flex-start; transition: all 0.2s; }
    .btn-bebida:hover { background: #e5e7eb; border-color: #9ca3af; }
    .mg-badge { font-size: 0.8rem; color: #4b5563; font-weight: 600; margin-top: 0.25rem; }
    .form-ingesta .form-group { margin-bottom: 1rem; }
    .form-ingesta label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.35rem; color: #374151; }
    .form-ingesta input { width: 100%; padding: 0.65rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem; }
    .btn-primary { width: 100%; background: #2563eb; color: white; border: none; padding: 0.75rem; border-radius: 6px; font-weight: 600; cursor: pointer; }
    .btn-primary:hover { background: #1d4ed8; }
    .offline-badge { margin-top: 0.75rem; font-size: 0.85rem; color: #d97706; background: #fef3c7; padding: 0.5rem; border-radius: 6px; }
    .metricas-box { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
    .metrica { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
    .metrica .label { font-size: 0.9rem; color: #64748b; }
    .metrica .valor { font-weight: 700; font-size: 1.1rem; color: #0f172a; }
    .metrica .valor.highlight { color: #0284c7; }
    .metrica .valor.exceso { color: #dc2626; }
    .push-section { border-top: 1px solid #e5e7eb; padding-top: 1rem; }
    .push-section h3 { font-size: 1.05rem; margin-bottom: 0.35rem; }
    .push-section p { font-size: 0.85rem; color: #6b7280; margin-bottom: 0.75rem; }
    .btn-secondary { background: #0d9488; color: white; border: none; padding: 0.6rem 1rem; border-radius: 6px; font-weight: 600; cursor: pointer; }
    .btn-secondary:hover { background: #0f766e; }
    .historial-card .vacio { color: #6b7280; font-style: italic; }
    .lista-ingestas { list-style: none; padding: 0; margin: 0; }
    .ingesta-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; }
    .ingesta-item .info { display: flex; flex-direction: column; }
    .ingesta-item .info strong { color: #1e293b; }
    .ingesta-item .info span { font-size: 0.85rem; color: #64748b; }
    .estado-sinc { display: flex; align-items: center; gap: 0.75rem; }
    .badge { font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600; }
    .badge.sincronizado { background: #dcfce7; color: #166534; }
    .badge.pendiente { background: #fef9c3; color: #854d0e; }
    .btn-eliminar { background: none; border: none; color: #ef4444; font-size: 1.25rem; cursor: pointer; }
  `]
})

export class CafeinaComponent implements OnInit {
  catalogoBebidas = [
    { nombre: 'Café pasado', mg: 95 },
    { nombre: 'Espresso', mg: 63 },
    { nombre: 'Té', mg: 47 },
    { nombre: 'Gaseosa cola', mg: 34 },
    { nombre: 'Energizante', mg: 80 }
  ];

  umbralCafeina = UMBRAL_CAFEINA_MG_DEFECTO;
  semividaH = SEMIVIDA_H_DEFECTO;

  nuevaIngesta = {
    nombre_bebida: 'Café pasado',
    miligramos: 95,
    fecha_hora: this.obtenerFechaHoraLocal()
  };

  onlineStatus = signal<boolean>(navigator.onLine);
  mostrarBannerIos = signal<boolean>(false);
  listaIngestas = signal<IngestaItem[]>([]);
  residualEstimadoBedtime = signal<number>(0);
  horaCorteCalculada = signal<string>('20:30');

  constructor(private swPush: SwPush) {}

  ngOnInit(): void {
    window.addEventListener('online', () => this.onlineStatus.set(true));
    window.addEventListener('offline', () => this.onlineStatus.set(false));

    const ua = navigator.userAgent;
    const isIos = /iphone|ipad|ipod/i.test(ua);
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in navigator && (navigator as any).standalone);
    if (isIos && !isInStandaloneMode) {
      this.mostrarBannerIos.set(true);
    }

    this.cargarIngestasLocales();
    this.recalcularFarmacocinetica();
  }

  cerrarBannerIos(): void {
    this.mostrarBannerIos.set(false);
  }

  seleccionarBebida(bebida: { nombre: string; mg: number }): void {
    this.nuevaIngesta.nombre_bebida = bebida.nombre;
    this.nuevaIngesta.miligramos = bebida.mg;
  }

  obtenerFechaHoraLocal(): string {
    const ahora = new Date();
    ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
    return ahora.toISOString().slice(0, 16);
  }

  registrarIngesta(event: Event): void {
    event.preventDefault();
    const item: IngestaItem = {
      client_id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
      nombre_bebida: this.nuevaIngesta.nombre_bebida,
      miligramos: Number(this.nuevaIngesta.miligramos),
      fecha_hora: new Date(this.nuevaIngesta.fecha_hora).toISOString(),
      sincronizado: this.onlineStatus()
    };

    const actual = this.listaIngestas();
    this.listaIngestas.set([item, ...actual]);
    this.guardarIngestasLocales();
    this.recalcularFarmacocinetica();

    this.nuevaIngesta.miligramos = 95;
    this.nuevaIngesta.fecha_hora = this.obtenerFechaHoraLocal();
  }

  eliminarIngesta(clientId: string): void {
    const filtrado = this.listaIngestas().filter(i => i.client_id !== clientId);
    this.listaIngestas.set(filtrado);
    this.guardarIngestasLocales();
    this.recalcularFarmacocinetica();
  }

  recalcularFarmacocinetica(): void {
    const ingestas = this.listaIngestas();
    const bedtime = new Date();
    bedtime.setHours(23, 0, 0, 0);

    let totalResidual = 0;
    for (const ing of ingestas) {
      const tIngesta = new Date(ing.fecha_hora);
      const horasTranscurridas = (bedtime.getTime() - tIngesta.getTime()) / 3600000;
      if (horasTranscurridas > 0) {
        const res = residual(ing.miligramos, horasTranscurridas, this.semividaH);
        totalResidual += res;
      }
    }

    this.residualEstimadoBedtime.set(totalResidual);

    try {
      const corteDate = calcularHoraCorte(bedtime, this.umbralCafeina, this.semividaH);
      const hh = String(corteDate.getHours()).padStart(2, '0');
      const mm = String(corteDate.getMinutes()).padStart(2, '0');
      this.horaCorteCalculada.set(`${hh}:${mm}`);
    } catch {
      this.horaCorteCalculada.set('20:30');
    }
  }

  cargarIngestasLocales(): void {
    try {
      const guardado = localStorage.getItem('circadiano_ingestas_cafeina');
      if (guardado) {
        this.listaIngestas.set(JSON.parse(guardado));
      }
    } catch {}
  }

  guardarIngestasLocales(): void {
    try {
      localStorage.setItem('circadiano_ingestas_cafeina', JSON.stringify(this.listaIngestas()));
    } catch {}
  }

  formatFecha(isoStr: string): string {
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoStr;
    }
  }

  suscribirPush(): void {
    if (this.swPush.isEnabled) {
      this.swPush.requestSubscription({
        serverPublicKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-8vMeAtU5CIg'
      })
      .then(sub => {
        fetch('/push/suscripciones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_usuario: 'usr_default',
            endpoint: sub.endpoint,
            clave_p256dh: sub.toJSON().keys?.['p256dh'] ?? '',
            clave_auth: sub.toJSON().keys?.['auth'] ?? ''
          })
        }).catch(() => {});
        alert('¡Suscripción Web Push activada correctamente!');
      })
      .catch(err => {
        alert('No se pudo activar las notificaciones push: ' + err);
      });
    } else {
      alert('Las notificaciones Push no están habilitadas en este entorno.');
    }
  }
}

