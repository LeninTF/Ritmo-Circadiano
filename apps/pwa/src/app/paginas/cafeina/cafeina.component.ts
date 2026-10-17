import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cafeina',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pagina">
      <h1>Mi cafeina</h1>
      <p>Aqui registraras tu cafeina y veras la hora limite para tomarla.</p>
    </section>
  `,
})
export class CafeinaComponent {}
