import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RespuestasRmeq, clasificarCronotipoDesdeRespuestas, sumarRespuestasRmeq } from '@circadiano/domain';
import { CategoriaCronotipo } from '@circadiano/contracts';

@Component({
  selector: 'app-rmeq',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="rmeq">
      <h2>Cronotipo (rMEQ 5 ítems)</h2>
      <form (ngSubmit)="calcular()">
        <label>1. ¿A qué hora te levantarías si pudieras? (1–5)
          <input type="number" [(ngModel)]="form.p1" name="p1" min="1" max="5" required />
        </label>
        <label>2. ¿A qué hora te acostarías si pudieras? (1–5)
          <input type="number" [(ngModel)]="form.p2" name="p2" min="1" max="5" required />
        </label>
        <label>3. ¿Depende del despertador para levantarte? (1–4)
          <input type="number" [(ngModel)]="form.p3" name="p3" min="1" max="4" required />
        </label>
        <label>4. ¿Qué tan fácil te resulta levantarte? (1–5)
          <input type="number" [(ngModel)]="form.p4" name="p4" min="1" max="5" required />
        </label>
        <label>5. ¿Cuándo te sientes más activo? (1–6)
          <input type="number" [(ngModel)]="form.p5" name="p5" min="1" max="6" required />
        </label>
        <button type="submit">Calcular</button>
      </form>
      @if(resultado()){
        <p>Puntaje: {{resultado()!.puntaje}} — {{resultado()!.categoria}}</p>
      }
    </section>
  `,
})
export class RmeqComponent {
  form: RespuestasRmeq = { p1: 3, p2: 3, p3: 2, p4: 3, p5: 4 };
  resultado = signal<{ puntaje: number; categoria: CategoriaCronotipo } | null>(null);

  calcular() {
    const puntaje = sumarRespuestasRmeq(this.form);
    const categoria = clasificarCronotipoDesdeRespuestas(this.form);
    this.resultado.set({ puntaje, categoria });
  }
}
