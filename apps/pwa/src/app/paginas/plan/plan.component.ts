import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-plan',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pagina">
      <h1>Mi plan del dia</h1>
      <p>Aqui veras tu plan de sueno, luz y descanso segun tu turno.</p>
    </section>
  `,
})
export class PlanComponent {}
