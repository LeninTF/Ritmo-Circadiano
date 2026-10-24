import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import type { AreaDto, RegistroDto } from '@circadiano/contracts';
import { AuthService } from './auth.service';
import { ESTILOS_FORMULARIO } from './estilos-formulario';
import { TarjetaComponent } from '../compartido/tarjeta/tarjeta.component';

// Opciones del instrumento (Anexo 3, Tabla 26).
export const RANGOS_EDAD = ['18–24', '25–34', '35–44', '45–54', '55–65', 'Más de 65'];
export const SEXOS = ['Masculino', 'Femenino', 'Prefiero no decir'];
export const CARGOS = [
  'Conductor',
  'Despachador',
  'Boletería o encomiendas',
  'Administración',
  'Gerencia',
  'Otro',
];

const MENSAJES: Record<string, string> = {
  correo_duplicado: 'Ya existe una cuenta con ese correo.',
  area_invalida: 'El área elegida no es válida. Elige otra.',
  consentimiento_requerido: 'Debes aceptar el consentimiento para participar.',
};

@Component({
  selector: 'app-registro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, TarjetaComponent],
  styles: ESTILOS_FORMULARIO,
  template: `
    @if (codigo(); as codigoParticipante) {
      <h1>Registro listo</h1>
      <app-tarjeta [heroe]="true">
        <p>Tu código de participante es:</p>
        <p class="codigo" aria-live="polite">{{ codigoParticipante }}</p>
        <p>Guárdalo: con este código se identifican tus datos en el estudio.</p>
      </app-tarjeta>
      <a class="boton" routerLink="/ingresar" style="display: block; margin-top: 16px">
        Ingresar
      </a>
    } @else {
      <h1>Crear cuenta</h1>
      <p>Tus datos se identifican con un código. La empresa solo ve resultados agregados.</p>
      <form [formGroup]="formulario" (ngSubmit)="enviar()" novalidate>
        <label>
          Correo
          <input type="email" formControlName="correo" autocomplete="email" />
        </label>
        <label>
          Clave
          <input type="password" formControlName="clave" autocomplete="new-password" />
          <span class="ayuda">Mínimo 8 caracteres.</span>
        </label>
        <label>
          Área
          <select formControlName="idArea">
            <option value="" disabled>Elige tu área</option>
            @for (area of areas(); track area.id) {
              <option [value]="area.id">{{ area.nombre }}</option>
            }
          </select>
        </label>
        <label>
          Cargo
          <select formControlName="cargo">
            <option value="">Prefiero no decir</option>
            @for (cargo of cargos; track cargo) { <option [value]="cargo">{{ cargo }}</option> }
          </select>
        </label>
        <label>
          Rango de edad
          <select formControlName="rangoEdad">
            <option value="">Prefiero no decir</option>
            @for (rango of rangosEdad; track rango) { <option [value]="rango">{{ rango }}</option> }
          </select>
        </label>
        <label>
          Sexo
          <select formControlName="sexo">
            <option value="">Prefiero no decir</option>
            @for (sexo of sexos; track sexo) { <option [value]="sexo">{{ sexo }}</option> }
          </select>
        </label>
        @if (error()) {
          <p class="error" role="alert">{{ error() }}</p>
        }
        <button class="boton" type="submit" [disabled]="enviando()">
          {{ enviando() ? 'Creando cuenta…' : 'Crear cuenta' }}
        </button>
      </form>
    }
  `,
})
export class RegistroComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly cargos = CARGOS;
  protected readonly rangosEdad = RANGOS_EDAD;
  protected readonly sexos = SEXOS;
  protected readonly areas = signal<AreaDto[]>([]);
  protected readonly error = signal('');
  protected readonly enviando = signal(false);
  protected readonly codigo = signal<string | null>(null);

  protected readonly formulario = this.fb.group({
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    clave: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
    idArea: ['', Validators.required],
    cargo: [''],
    rangoEdad: [''],
    sexo: [''],
  });

  ngOnInit(): void {
    this.auth.listarAreas().subscribe({
      next: (areas) => this.areas.set(areas),
      error: () => this.error.set('No pudimos cargar las áreas. Revisa tu conexión.'),
    });
  }

  protected enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.error.set('Revisa el correo, la clave (mínimo 8 caracteres) y el área.');
      return;
    }
    const { cargo, rangoEdad, sexo, ...resto } = this.formulario.getRawValue();
    const dto: RegistroDto = {
      ...resto,
      ...(cargo && { cargo }),
      ...(rangoEdad && { rangoEdad }),
      ...(sexo && { sexo }),
      consentimiento: true,
    };
    this.error.set('');
    this.enviando.set(true);
    this.auth.registrar(dto).subscribe({
      next: (usuario) => {
        this.enviando.set(false);
        this.codigo.set(usuario.codigoParticipante);
      },
      error: (e: unknown) => {
        this.enviando.set(false);
        const codigo = e instanceof HttpErrorResponse ? e.error?.code : undefined;
        this.error.set(MENSAJES[codigo] ?? 'No pudimos crear la cuenta. Intenta de nuevo.');
      },
    });
  }
}
