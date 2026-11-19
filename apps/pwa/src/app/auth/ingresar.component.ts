import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';
import { ESTILOS_FORMULARIO } from './estilos-formulario';
import { SesionService } from './sesion.service';
import { INICIO_POR_ROL } from '../navegacion-rol';

@Component({
  selector: 'app-ingresar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  styles: ESTILOS_FORMULARIO,
  template: `
    <h1>Ingresar</h1>
    <form [formGroup]="formulario" (ngSubmit)="enviar()" novalidate>
      <label>
        Correo
        <input type="email" formControlName="correo" autocomplete="username" />
      </label>
      <label>
        Clave
        <input type="password" formControlName="clave" autocomplete="current-password" />
      </label>
      @if (error()) {
        <p class="error" role="alert">{{ error() }}</p>
      }
      <button class="boton" type="submit" [disabled]="enviando()">
        {{ enviando() ? 'Ingresando…' : 'Ingresar' }}
      </button>
      <a class="enlace" routerLink="/consentimiento">Quiero participar (crear cuenta)</a>
    </form>
  `,
})
export class IngresarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);
  private readonly sesion = inject(SesionService);
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly error = signal('');
  protected readonly enviando = signal(false);
  protected readonly formulario = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', Validators.required],
  });

  protected enviar(): void {
    if (this.formulario.invalid) {
      this.error.set('Escribe tu correo y tu clave.');
      return;
    }
    this.error.set('');
    this.enviando.set(true);
    this.auth.iniciarSesion(this.formulario.getRawValue()).subscribe({
      next: () => {
        this.enviando.set(false);
        void this.router.navigateByUrl(this.destino());
      },
      error: (e: unknown) => {
        this.enviando.set(false);
        const sinConexion = e instanceof HttpErrorResponse && e.status === 0;
        this.error.set(
          sinConexion
            ? 'No hay conexión. Intenta de nuevo cuando vuelvas a estar en línea.'
            : 'Correo o clave incorrectos.',
        );
      },
    });
  }

  /** Solo rutas internas: evita redirigir a un sitio externo con ?retorno=. Sin retorno, el inicio de su rol. */
  private destino(): string {
    const retorno = this.ruta.snapshot.queryParamMap.get('retorno');
    if (retorno?.startsWith('/') && !retorno.startsWith('//')) return retorno;
    const rol = this.sesion.rol();
    return rol ? INICIO_POR_ROL[rol] : '/plataforma';
  }
}
