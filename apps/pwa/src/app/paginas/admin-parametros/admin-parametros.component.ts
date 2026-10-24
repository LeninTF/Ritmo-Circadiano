import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import type { ParametroSistemaDto } from '@circadiano/contracts';
import { ESTILOS_FORMULARIO } from '../../auth/estilos-formulario';
import { environment } from '../../../environments/environment';

/** Administrador: parametros del sistema (ERD02), p. ej. el umbral de cafeina RN02. */
@Component({
  selector: 'app-admin-parametros',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ESTILOS_FORMULARIO,
  template: `
    <h1>Parámetros del sistema</h1>
    <p>Los cambios aplican a los cálculos nuevos y quedan registrados en la auditoría.</p>
    @if (error()) {
      <div class="error" role="alert">{{ error() }}</div>
    }
    @for (p of parametros(); track p.clave) {
      <form (submit)="guardar($event, p.clave, valor.value)">
        <label>
          {{ p.descripcion }}
          <input #valor inputmode="decimal" [value]="p.valor" [attr.aria-describedby]="'ayuda-' + p.clave" />
          <span class="ayuda" [id]="'ayuda-' + p.clave">Clave: {{ p.clave }}</span>
        </label>
        <button class="boton" type="submit">Guardar</button>
      </form>
    }
    @if (guardado()) {
      <p role="status">Guardado: {{ guardado() }}</p>
    }
  `,
})
export class AdminParametrosComponent {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/admin/parametros`;
  protected readonly parametros = signal<ParametroSistemaDto[]>([]);
  protected readonly error = signal('');
  protected readonly guardado = signal('');

  constructor() {
    this.http.get<ParametroSistemaDto[]>(this.url).subscribe({
      next: (lista) => this.parametros.set(lista),
      error: () => this.error.set('No se pudieron cargar los parámetros.'),
    });
  }

  protected guardar(evento: Event, clave: string, valor: string): void {
    evento.preventDefault();
    this.error.set('');
    this.guardado.set('');
    this.http.put<ParametroSistemaDto>(`${this.url}/${encodeURIComponent(clave)}`, { valor }).subscribe({
      next: (p) => {
        this.parametros.update((lista) => lista.map((x) => (x.clave === p.clave ? p : x)));
        this.guardado.set(`${p.clave} = ${p.valor}`);
      },
      error: (e: HttpErrorResponse) =>
        this.error.set(e.status === 400 ? (e.error?.message ?? 'Valor no válido.') : 'No se pudo guardar.'),
    });
  }
}
