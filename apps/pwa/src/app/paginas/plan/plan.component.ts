import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-plan',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pagina">
      <h1>Mi plan del día</h1>
      <div class="timeline">
        <div class="hour">00</div><div class="hour">01</div><div class="hour">02</div><div class="hour">03</div>
        <div class="hour">04</div><div class="hour">05</div><div class="hour">06</div><div class="hour">07</div>
        <div class="hour">08</div><div class="hour">09</div><div class="hour">10</div><div class="hour">11</div>
        <div class="hour">12</div><div class="hour">13</div><div class="hour">14</div><div class="hour">15</div>
        <div class="hour">16</div><div class="hour">17</div><div class="hour">18</div><div class="hour">19</div>
        <div class="hour">20</div><div class="hour">21</div><div class="hour">22</div><div class="hour">23</div>
      </div>
      <div class="blocks">
        <div class="block sueno" [style.left.%]="0" [style.width.%]="8">Sueño</div>
        <div class="block luz"   [style.left.%]="30" [style.width.%]="6">Luz</div>
        <div class="block siesta" [style.left.%]="40" [style.width.%]="4">Siesta</div>
        <div class="block pico"  [style.left.%]="55" [style.width.%]="5">Pico</div>
        <div class="block corte" [style.left.%]="75" [style.width.%]="2">Corte cafeína</div>
      </div>
    </section>
  `,
  styles: [`
    .timeline { display:grid; grid-template-columns: repeat(24,1fr); font-size:10px; }
    .blocks { position:relative; height:40px; }
    .block { position:absolute; top:0; height:100%; opacity:.6; }
    .sueno { background:#4A90E2; }
    .luz { background:#F5A623; }
    .siesta { background:#7ED321; }
    .pico { background:#BD10E0; }
    .corte { background:#D0021B; }
  `]
})
export class PlanComponent {}

