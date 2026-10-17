import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-diario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pagina">
      <h1>Mi diario de sueno</h1>
      <p>Aqui registraras como dormiste y como te sientes.</p>
    </section>
  `,
})
export class DiarioComponent {}
