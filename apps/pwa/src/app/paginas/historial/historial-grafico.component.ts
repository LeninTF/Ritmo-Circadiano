import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  Chart,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import type { HistorialDiaDto } from '@circadiano/contracts';
import { fechaCivil } from './historial-fecha';

Chart.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
);

@Component({
  selector: 'app-historial-grafico',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="grafico">
    <canvas
      #canvas
      role="img"
      [attr.aria-label]="titulo + ' (' + unidad + ')'"
      aria-describedby="ayuda-graficos"
      >Consulta los valores en la tabla del historial.</canvas
    >
  </div>`,
  styles: ['.grafico { position: relative; height: 240px; }'],
})
export class HistorialGraficoComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input({ required: true }) dias: HistorialDiaDto[] = [];
  @Input({ required: true }) campo: 'horasSueno' | 'cafeinaResidual' =
    'horasSueno';
  @Input({ required: true }) titulo = '';
  @Input({ required: true }) unidad = '';
  @ViewChild('canvas', { static: true })
  private canvas!: ElementRef<HTMLCanvasElement>;
  private grafico?: Chart<'line', (number | null)[], string>;
  private mutationObserver?: MutationObserver;

  ngAfterViewInit(): void {
    const estilo = getComputedStyle(this.canvas.nativeElement);
    const color = estilo.getPropertyValue('--color-primario').trim();
    const texto = estilo.color;
    this.grafico = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: `${this.titulo} (${this.unidad})`,
            data: [],
            borderColor: color,
            backgroundColor: color,
            spanGaps: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Fecha (America/Lima)',
              color: texto,
            },
            ticks: { color: texto },
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: this.unidad, color: texto },
            ticks: { color: texto },
          },
        },
      },
    });
    this.actualizar();
    if (typeof MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver(() => {
        this.actualizarColores();
      });
      this.mutationObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-tema'],
      });
    }
  }

  ngOnChanges(): void {
    this.actualizar();
  }

  ngOnDestroy(): void {
    this.mutationObserver?.disconnect();
    this.grafico?.destroy();
    this.grafico = undefined;
  }

  private actualizarColores(): void {
    if (!this.grafico) return;
    const estilo = getComputedStyle(this.canvas.nativeElement);
    const color = estilo.getPropertyValue('--color-primario').trim();
    const texto = estilo.color;
    const [serie] = this.grafico.data.datasets;
    serie.borderColor = serie.backgroundColor = color;
    // Las escalas x e y siempre existen: se crean en ngAfterViewInit.
    const { x, y } = this.grafico.options.scales as Record<
      'x' | 'y',
      { title: { color: string }; ticks: { color: string } }
    >;
    x.title.color = x.ticks.color = y.title.color = y.ticks.color = texto;
    this.grafico.update();
  }

  private actualizar(): void {
    if (!this.grafico) return;
    this.grafico.data.labels = this.dias.map((dia) => fechaCivil(dia.fecha));
    this.grafico.data.datasets[0].data = this.dias.map(
      (dia) => dia[this.campo],
    );
    this.grafico.update();
  }
}
