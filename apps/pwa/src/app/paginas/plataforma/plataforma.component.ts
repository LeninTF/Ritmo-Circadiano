import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-plataforma',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pagina">
      <h1>Plataforma</h1>
      <p>Aqui iniciaras sesion y gestionaras tu participacion en el estudio.</p>
    </section>
  `,
})
export class PlataformaComponent {}
