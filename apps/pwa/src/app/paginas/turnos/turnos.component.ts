import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-turnos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pagina">
      <h1>Mis turnos</h1>
      <p>Aqui veras tus turnos de trabajo y las rutas asignadas.</p>
    </section>
  `,
})
export class TurnosComponent {}
