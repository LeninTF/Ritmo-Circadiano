import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TurnosService } from './turnos.service';
import { OfflineStoreService } from '../../core/offline/offline-store.service';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pagina">
      @if (!isOnline()) {
        <div style="background:#fef3c7;border:1px solid #f59e0b;color:#92400e;padding:0.75rem 1rem;border-radius:0.5rem;margin-bottom:1rem;display:flex;align-items:center;justify-content:space-between;">
          <span>⚠️ <strong>Modo Sin Conexión (Offline):</strong> Mostrando turnos y rutas desde el caché local (OfflineStore).</span>
          <span style="font-size:0.85rem;background:#f59e0b;color:#fff;padding:0.2rem 0.5rem;border-radius:0.25rem;">Offline</span>
        </div>
      }

      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <h1>Grilla Semanal de Turnos</h1>
        <div>
          <button class="btn" style="margin-right:0.5rem;" (click)="abrirModalCrear()">+ Nuevo</button>
          <button class="btn" (click)="imp.set(!imp())">📂 Importar</button>
        </div>
      </div>
      @if (imp()) {
        <div style="background:var(--color-acento-fondo);padding:1rem;border-radius:0.5rem;margin-bottom:1rem;">
          <h3>Importador CSV / XLSX</h3>
          <input type="file" (change)="fileSel($event)" accept=".csv,.xlsx" />
          <button class="btn" [disabled]="!arch()" (click)="importar()" style="margin-left:0.5rem;">Procesar</button>
          @if (resImp()) { <pre>{{ resImp() | json }}</pre> }
        </div>
      }
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <div>
          <button (click)="sem(-1)">‹ Anterior</button>
          <span style="margin:0 1rem;font-weight:600;">{{ fini }} al {{ ffin }}</span>
          <button (click)="sem(1)">Siguiente ›</button>
        </div>
        <div>
          <label for="turnos-uuid">UUID: </label>
          <input id="turnos-uuid" [value]="usr()" (input)="usr.set($any($event.target).value)" />
          <button (click)="cargar()" style="margin-left:0.5rem;">Filtrar</button>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:0.5rem;overflow-x:auto;">
        @for (d of dias(); track d.fecha) {
          <div style="border:1px solid var(--color-borde);border-radius:0.5rem;padding:0.5rem;min-height:300px;">
            <div style="font-weight:600;text-align:center;border-bottom:1px solid var(--color-borde);padding-bottom:0.25rem;">
              <div>{{ d.nombre }}</div><small>{{ d.fecha }}</small>
            </div>
            @for (t of map.get(d.fecha) || []; track t.id) {
              <div style="background:var(--color-acento-fondo);border-radius:0.35rem;padding:0.5rem;margin-top:0.5rem;font-size:0.85rem;">
                <div><strong>Ruta:</strong> {{ t.idRuta | slice:0:6 }}...</div>
                <div><strong>Horas:</strong> {{ t.horasConduccion }}h</div>
                <div><strong>Estado:</strong> {{ t.estadoConfirmacion }}</div>
                @if (t.esNocturno) { <span style="color:purple;">Nocturno</span> }
                <div style="margin-top:0.25rem;display:flex;gap:0.5rem;">
                  <button (click)="editar(t)">✏️</button><button (click)="del(t.id)">🗑️</button>
                </div>
              </div>
            }
          </div>
        }
      </div>
      @if (mod()) {
        <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:100;">
          <div style="background:var(--color-fondo);padding:1.5rem;border-radius:0.5rem;width:400px;max-height:90vh;overflow-y:auto;">
            <h2>{{ editando() ? 'Editar' : 'Nuevo' }} Turno</h2>
            <form [formGroup]="form" (ngSubmit)="guardar()">
              <div style="margin-bottom:0.5rem;"><label for="turno-id-usuario">ID Usuario:</label><input id="turno-id-usuario" formControlName="idUsuario" style="width:100%;" /></div>
              <div style="margin-bottom:0.5rem;">
                <label for="turno-ruta">Ruta:</label>
                <select id="turno-ruta" formControlName="idRuta" style="width:100%;">
                  <option value="">Seleccione</option>
                  @for (r of rutas(); track r.id) { <option [value]="r.id">{{ r.origen }} - {{ r.destino }}</option> }
                </select>
              </div>
              <div style="margin-bottom:0.5rem;"><label for="turno-fecha">Fecha:</label><input id="turno-fecha" type="date" formControlName="fecha" style="width:100%;" /></div>
              <div style="margin-bottom:0.5rem;"><label for="turno-inicio">Inicio:</label><input id="turno-inicio" type="datetime-local" formControlName="inicioProgramado" style="width:100%;" /></div>
              <div style="margin-bottom:0.5rem;"><label for="turno-fin">Fin:</label><input id="turno-fin" type="datetime-local" formControlName="finProgramado" style="width:100%;" /></div>
              <div style="margin-bottom:0.5rem;"><label for="turno-horas">Horas:</label><input id="turno-horas" type="number" step="0.5" formControlName="horasConduccion" style="width:100%;" /></div>
              <div style="margin-bottom:0.5rem;"><label><input type="checkbox" formControlName="esNocturno" /> Nocturno</label></div>
              @if (conf()) {
                <div style="background:#fef3c7;color:#92400e;padding:0.5rem;margin-bottom:0.5rem;">
                  <strong>Alerta RF14:</strong> Exceso de jornada.
                  <div><label><input type="checkbox" formControlName="confirmarExceso" /> Confirmar exceso</label></div>
                  <textarea formControlName="motivoExceso" placeholder="Motivo..." style="width:100%;"></textarea>
                </div>
              }
              @if (err()) { <div style="color:red;font-size:0.85rem;">{{ err() }}</div> }
              <div style="display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1rem;">
                <button type="button" (click)="mod.set(false)">Cancelar</button>
                <button type="submit" [disabled]="form.invalid">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      }
    </section>
  `,
})
export class TurnosComponent implements OnInit {
  private readonly svc = inject(TurnosService);
  readonly offlineStore = inject(OfflineStoreService);
  private readonly fb = inject(FormBuilder);
  
  readonly isOnline = signal<boolean>(navigator.onLine);

  constructor() {
    window.addEventListener('online', () => this.isOnline.set(true));
    window.addEventListener('offline', () => this.isOnline.set(false));
  }

  rutas = signal<any[]>([]);
  usr = signal<string>('00000000-0000-0000-0000-000000000001');
  imp = signal(false);
  arch = signal<File | null>(null);
  resImp = signal<any>(null);
  mod = signal(false);
  editando = signal(false);
  tId = signal<string | null>(null);
  conf = signal(false);
  err = signal<string | null>(null);
  base = signal(new Date());
  fini = ''; ffin = '';
  dias = signal<any[]>([]);
  map = new Map<string, any[]>();
  form: FormGroup = this.fb.group({
    idUsuario: ['', Validators.required],
    idRuta: ['', Validators.required],
    fecha: ['', Validators.required],
    inicioProgramado: ['', Validators.required],
    finProgramado: ['', Validators.required],
    horasConduccion: [4, [Validators.required, Validators.min(0.5)]],
    esNocturno: [false],
    confirmarExceso: [false],
    motivoExceso: [''],
  });
  ngOnInit(): void {
    this.svc.listarRutas().subscribe((r) => this.rutas.set(r));
    this.calc(new Date());
    this.cargar();
  }
  calc(d: Date): void {
    const c = new Date(d);
    const day = c.getDay();
    const diff = c.getDate() - day + (day === 0 ? -6 : 1);
    const m = new Date(c.setDate(diff));
    const nombres = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const dt = new Date(m);
      dt.setDate(m.getDate() + i);
      arr.push({ nombre: nombres[i], fecha: dt.toISOString().split('T')[0] });
    }
    this.dias.set(arr);
    this.fini = arr[0].fecha;
    this.ffin = arr[6].fecha;
  }
  sem(dir: number): void {
    const b = new Date(this.base());
    b.setDate(b.getDate() + dir * 7);
    this.base.set(b);
    this.calc(b);
    this.cargar();
  }
  cargar(): void {
    this.svc.listarTurnosMe(this.fini, this.ffin, this.usr()).subscribe({
      next: (t) => this.ag(t),
      error: () => this.svc.listarTurnos(this.usr()).subscribe((t) => this.ag(t)),
    });
  }
  ag(ts: any[]): void {
    this.map.clear();
    for (const d of this.dias()) this.map.set(d.fecha, []);
    for (const t of ts) {
      const f = t.fecha ? t.fecha.split('T')[0] : '';
      if (this.map.has(f)) this.map.get(f)?.push(t);
    }
  }
  fileSel(e: any): void { this.arch.set(e.target.files[0] || null); }
  importar(): void {
    const f = this.arch();
    if (f) this.svc.importarTurnos(f).subscribe({ next: (r) => { this.resImp.set(r); this.cargar(); }, error: (e) => this.resImp.set({ error: e.error?.message }) });
  }
  abrirModalCrear(): void {
    this.editando.set(false);
    this.tId.set(null);
    this.conf.set(false);
    this.err.set(null);
    this.form.reset({ idUsuario: this.usr(), idRuta: '', fecha: new Date().toISOString().split('T')[0], horasConduccion: 4, esNocturno: false, confirmarExceso: false, motivoExceso: '' });
    this.mod.set(true);
  }
  editar(t: any): void {
    this.editando.set(true);
    this.tId.set(t.id);
    this.conf.set(false);
    this.err.set(null);
    this.form.patchValue({ idUsuario: t.idUsuario, idRuta: t.idRuta, fecha: t.fecha?.split('T')[0], inicioProgramado: t.inicioProgramado?.slice(0, 16), finProgramado: t.finProgramado?.slice(0, 16), horasConduccion: t.horasConduccion, esNocturno: t.esNocturno, confirmarExceso: false, motivoExceso: '' });
    this.mod.set(true);
  }
  guardar(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const dto = { ...v, horasConduccion: Number(v.horasConduccion), inicioProgramado: new Date(v.inicioProgramado).toISOString(), finProgramado: new Date(v.finProgramado).toISOString() };
    const obs = this.editando() ? this.svc.actualizarTurno(this.tId()!, dto) : this.svc.crearTurno(dto);
    obs.subscribe({
      next: () => { this.mod.set(false); this.cargar(); },
      error: (e) => {
        if (e.status === 409) { this.conf.set(true); this.err.set(e.error?.message || 'Exceso de jornada (RF14)'); }
        else { this.err.set(e.error?.message || 'Error'); }
      }
    });
  }
  del(id: string): void { if (confirm('¿Eliminar?')) this.svc.eliminarTurno(id).subscribe(() => this.cargar()); }
}