import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TarjetaComponent } from '../compartido/tarjeta/tarjeta.component';
import { ESTILOS_FORMULARIO } from './estilos-formulario';
import { FlujoRegistroService } from './flujo-registro.service';

@Component({
  selector: 'app-consentimiento',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TarjetaComponent],
  styles: ESTILOS_FORMULARIO,
  template: `
    <h1>Consentimiento informado</h1>
    <app-tarjeta>
      <p>
        Usted ha sido invitado a participar en el estudio «Aplicación web basada en
        arquitectura empresarial TOGAF para la gestión de ritmos circadianos y la mejora
        de la calidad del sueño de los trabajadores de Transporte Cueva S.A.C., Nasca – Ica,
        2026», realizado por estudiantes de Ingeniería de Sistemas e Informática de la
        Universidad Tecnológica del Perú.
      </p>
      <p>
        Su participación consiste en responder un cuestionario sobre su sueño y hábitos al
        inicio y al final del estudio y, si lo desea, usar la aplicación web durante
        aproximadamente seis semanas.
      </p>
      <p>
        La participación es voluntaria; puede retirarse en cualquier momento sin consecuencia
        alguna en su trabajo. Sus datos se identificarán con un código, se usarán solo con
        fines académicos y la empresa únicamente conocerá resultados agregados. La aplicación
        no reemplaza la atención médica.
      </p>
    </app-tarjeta>
    <form (submit)="continuar($event)" style="margin-top: 16px">
      <label class="casilla">
        <input type="checkbox" [checked]="acepta()" (change)="acepta.set($any($event.target).checked)" />
        <span>Acepto participar en el estudio</span>
      </label>
      <button class="boton" type="submit" [disabled]="!acepta()">Continuar</button>
      <a class="enlace" routerLink="/ingresar">Ya tengo cuenta</a>
    </form>
  `,
})
export class ConsentimientoComponent {
  private readonly flujo = inject(FlujoRegistroService);
  private readonly router = inject(Router);
  protected readonly acepta = signal(this.flujo.consentimientoAceptado());

  protected continuar(evento: Event): void {
    evento.preventDefault();
    if (!this.acepta()) return;
    this.flujo.consentimientoAceptado.set(true);
    void this.router.navigate(['/registro']);
  }
}
