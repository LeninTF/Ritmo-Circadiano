import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DiarioService, EstadoGuardadoDiario } from './diario.service';
import { RegistroSuenoDto } from '@circadiano/contracts';

@Component({
  selector: 'app-diario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './diario.component.html',
  styleUrl: './diario.component.scss',
})
export class DiarioComponent {
  private fb = inject(NonNullableFormBuilder);
  private diarioService = inject(DiarioService);

  readonly guardando = signal<boolean>(false);
  readonly estadoGuardado = signal<EstadoGuardadoDiario>('inicial');

  readonly form = this.fb.group({
    fecha: [new Date().toISOString().split('T')[0], [Validators.required]],
    horaAcostarse: ['22:00', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
    horaDespertar: ['06:00', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
    latenciaMin: [15, [Validators.required, Validators.min(0), Validators.max(180)]],
    despertares: [1, [Validators.required, Validators.min(0), Validators.max(20)]],
    calidadPercibida: [4, [Validators.required, Validators.min(1), Validators.max(5)]],
    fatigaPercibida: [2, [Validators.required, Validators.min(1), Validators.max(5)]],
    esDiaLaboral: [true, [Validators.required]],
    luzMatutinaMin: [30, [Validators.required, Validators.min(0), Validators.max(180)]],
  });

  obtenerTextoCalidad(val: number): string {
    const textos: Record<number, string> = { 1: 'Muy mala', 2: 'Mala', 3: 'Regular', 4: 'Buena', 5: 'Excelente' };
    return textos[val] || '';
  }

  obtenerTextoFatiga(val: number): string {
    const textos: Record<number, string> = { 1: 'Muy fresco', 2: 'Ligera', 3: 'Moderada', 4: 'Alta', 5: 'Extrema' };
    return textos[val] || '';
  }

  guardar(forzarError = false): void {
    if (this.form.invalid || this.guardando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.estadoGuardado.set('guardando');

    const raw = this.form.getRawValue();
    const dto: RegistroSuenoDto = {
      clientId: crypto.randomUUID(),
      fecha: raw.fecha,
      horaAcostarse: raw.horaAcostarse,
      horaDespertar: raw.horaDespertar,
      latenciaMin: Number(raw.latenciaMin),
      despertares: Number(raw.despertares),
      calidadPercibida: Number(raw.calidadPercibida),
      fatigaPercibida: Number(raw.fatigaPercibida),
      esDiaLaboral: Boolean(raw.esDiaLaboral),
      luzMatutinaMin: Number(raw.luzMatutinaMin),
    };

    this.diarioService.guardarDiario(dto, forzarError).subscribe({
      next: (res) => {
        this.guardando.set(false);
        this.estadoGuardado.set(res.estado);
      },
      error: (err) => {
        this.guardando.set(false);
        const mensaje = err?.message || '';
        if (mensaje.includes('Guardado persistente deshabilitado')) {
          this.estadoGuardado.set('integracion_pendiente');
        } else {
          this.estadoGuardado.set('error');
        }
      },
    });
  }
}
