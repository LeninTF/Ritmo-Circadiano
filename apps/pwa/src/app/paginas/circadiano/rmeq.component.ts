import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import type { CategoriaCronotipo, PerfilCronotipoDto, RespuestasRmeq } from '@circadiano/contracts';
import { environment } from '../../../environments/environment';
import { TarjetaComponent } from '../../compartido/tarjeta/tarjeta.component';

interface Pregunta {
  clave: keyof RespuestasRmeq;
  texto: string;
  opciones: { texto: string; valor: number }[];
}

/** rMEQ de 5 ítems (Adan y Almirall, 1991); puntajes de cada opción según el instrumento. */
export const PREGUNTAS_RMEQ: readonly Pregunta[] = [
  {
    clave: 'p1',
    texto: 'Si pudieras organizar tu día libremente, ¿a qué hora te levantarías?',
    opciones: [
      { texto: '05:00 – 06:30', valor: 5 },
      { texto: '06:30 – 07:45', valor: 4 },
      { texto: '07:45 – 09:45', valor: 3 },
      { texto: '09:45 – 11:00', valor: 2 },
      { texto: '11:00 – 12:00', valor: 1 },
    ],
  },
  {
    clave: 'p2',
    texto: 'Durante la primera media hora después de despertar, ¿cómo te sientes?',
    opciones: [
      { texto: 'Muy cansado', valor: 1 },
      { texto: 'Bastante cansado', valor: 2 },
      { texto: 'Bastante descansado', valor: 3 },
      { texto: 'Muy descansado', valor: 4 },
    ],
  },
  {
    clave: 'p3',
    texto: '¿A qué hora de la noche te sientes cansado y con ganas de dormir?',
    opciones: [
      { texto: '20:00 – 21:00', valor: 5 },
      { texto: '21:00 – 22:15', valor: 4 },
      { texto: '22:15 – 00:45', valor: 3 },
      { texto: '00:45 – 02:00', valor: 2 },
      { texto: '02:00 – 03:00', valor: 1 },
    ],
  },
  {
    clave: 'p4',
    texto: '¿A qué hora del día te sientes mejor?',
    opciones: [
      { texto: '05:00 – 08:00', valor: 5 },
      { texto: '08:00 – 10:00', valor: 4 },
      { texto: '10:00 – 17:00', valor: 3 },
      { texto: '17:00 – 22:00', valor: 2 },
      { texto: '22:00 – 05:00', valor: 1 },
    ],
  },
  {
    clave: 'p5',
    texto: 'Hay personas "de mañana" y personas "de noche". ¿Cuál eres tú?',
    opciones: [
      { texto: 'Claramente de mañana', valor: 6 },
      { texto: 'Más de mañana que de noche', valor: 4 },
      { texto: 'Más de noche que de mañana', valor: 2 },
      { texto: 'Claramente de noche', valor: 0 },
    ],
  },
];

const NOMBRE_CATEGORIA: Record<CategoriaCronotipo, string> = {
  vespertino_definido: 'Claramente de noche',
  vespertino_moderado: 'Más bien de noche',
  intermedio: 'Intermedio',
  matutino_moderado: 'Más bien de mañana',
  matutino_definido: 'Claramente de mañana',
};

/** RF03: cuestionario de cronotipo; el servidor calcula y guarda el resultado (RN07). */
@Component({
  selector: 'app-rmeq',
  imports: [RouterLink, TarjetaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="pagina">
      <h1>Tu cronotipo</h1>
      <p class="nota">5 preguntas para ajustar tu plan a tu reloj interno. No hay respuestas buenas ni malas.</p>

      <form (submit)="$event.preventDefault(); enviar()">
        @for (pregunta of preguntas; track pregunta.clave; let i = $index) {
          <app-tarjeta>
            <fieldset>
              <legend>{{ i + 1 }}. {{ pregunta.texto }}</legend>
              @for (opcion of pregunta.opciones; track opcion.valor) {
                <label class="opcion">
                  <input
                    type="radio"
                    [name]="pregunta.clave"
                    [checked]="respuestas()[pregunta.clave] === opcion.valor"
                    (change)="responder(pregunta.clave, opcion.valor)"
                  />
                  {{ opcion.texto }}
                </label>
              }
            </fieldset>
          </app-tarjeta>
        }

        @if (error()) {
          <p class="nota" role="alert">{{ error() }}</p>
        }
        <button type="submit" class="boton" [disabled]="!completo() || enviando()">Guardar respuestas</button>
      </form>

      @if (resultado(); as r) {
        <app-tarjeta [heroe]="true" role="status">
          <p class="micro">TU CRONOTIPO</p>
          <p class="resultado">{{ nombre(r.categoria) }}</p>
          <p class="nota">Puntaje {{ r.puntaje }} de 25. Tu plan se ajustará desde el próximo turno.</p>
          <a class="enlace" routerLink="/plan">Ver mi plan</a>
        </app-tarjeta>
      }
    </section>
  `,
  styles: `
    .pagina {
      display: flex;
      flex-direction: column;
      gap: 14px;
      max-width: 390px;
      margin: 0 auto;
      padding: 16px 20px;
    }
    h1 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-texto);
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    fieldset {
      margin: 0;
      padding: 0;
      border: 0;
    }
    legend {
      margin-bottom: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-texto);
    }
    .opcion {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 44px;
      font-size: 0.8125rem;
      color: var(--color-texto);
    }
    .opcion input {
      width: 20px;
      height: 20px;
      accent-color: var(--color-primario);
    }
    .nota {
      margin: 0;
      font-size: 0.8125rem;
      color: var(--color-texto-2);
    }
    .micro {
      margin: 0;
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.6px;
      color: var(--color-texto-2);
    }
    .resultado {
      margin: 4px 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-texto);
    }
    .boton {
      min-height: 44px;
      font: inherit;
      font-weight: 600;
      color: var(--color-superficie);
      background: var(--color-primario);
      border: 0;
      border-radius: var(--radio-boton);
    }
    .boton:disabled {
      opacity: 0.5;
    }
    .enlace {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      font-weight: 600;
      color: var(--color-primario);
    }
  `,
})
export class RmeqComponent {
  private readonly http = inject(HttpClient);

  readonly preguntas = PREGUNTAS_RMEQ;
  readonly respuestas = signal<Partial<RespuestasRmeq>>({});
  readonly completo = computed(() => this.preguntas.every((p) => this.respuestas()[p.clave] !== undefined));
  readonly enviando = signal(false);
  readonly error = signal('');
  readonly resultado = signal<PerfilCronotipoDto | null>(null);

  responder(clave: keyof RespuestasRmeq, valor: number): void {
    this.respuestas.update((r) => ({ ...r, [clave]: valor }));
  }

  nombre(categoria: CategoriaCronotipo): string {
    return NOMBRE_CATEGORIA[categoria];
  }

  async enviar(): Promise<void> {
    if (!this.completo()) return;
    this.enviando.set(true);
    this.error.set('');
    try {
      this.resultado.set(
        await firstValueFrom(this.http.post<PerfilCronotipoDto>(`${environment.apiUrl}/cronotipo`, this.respuestas())),
      );
    } catch {
      this.error.set('No se pudo guardar. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      this.enviando.set(false);
    }
  }
}
