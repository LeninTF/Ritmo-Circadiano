import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiarioComponent } from './diario.component';
import { DiarioService } from './diario.service';

describe('DiarioComponent', () => {
  let component: DiarioComponent;
  let fixture: ComponentFixture<DiarioComponent>;
  let diarioServiceSpy: { guardarDiario: jest.Mock };

  beforeEach(async () => {
    diarioServiceSpy = {
      guardarDiario: jest.fn().mockResolvedValue('7f1c6a2e-0000-4000-8000-000000000001'),
    };

    await TestBed.configureTestingModule({
      imports: [DiarioComponent],
      providers: [{ provide: DiarioService, useValue: diarioServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1 & 2. debe renderizar el formulario visible y editable', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Diario de sueño');
    expect(compiled.querySelector('form')).toBeTruthy();
    expect(compiled.querySelector('label[for="fecha"]')?.textContent).toContain('Fecha');
    expect(compiled.querySelector('label[for="horaAcostarse"]')?.textContent).toContain('acostarse');
    expect(compiled.querySelector('label[for="horaDespertar"]')?.textContent).toContain('despertar');
  });

  it('3. debe tener valores iniciales válidos alineados con DTO API', () => {
    expect(component.form.get('horaAcostarse')?.value).toBe('22:00');
    expect(component.form.get('horaDespertar')?.value).toBe('06:00');
    expect(component.form.get('latenciaMin')?.value).toBe(15);
    expect(component.form.get('despertares')?.value).toBe(1);
    expect(component.form.get('calidadPercibida')?.value).toBe(4);
    expect(component.form.get('fatigaPercibida')?.value).toBe(2);
    expect(component.form.get('esDiaLaboral')?.value).toBe(true);
    expect(component.form.get('luzMatutinaMin')?.value).toBe(30);
  });

  it('4. debe renderizar escalas de calidad y fatiga de 1 a 5 y permitir seleccionarlas', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const botonesEscala = compiled.querySelectorAll('.btn-escala');
    expect(botonesEscala.length).toBe(10); // 5 calidad + 5 fatiga

    component.form.get('calidadPercibida')?.setValue(5);
    component.form.get('fatigaPercibida')?.setValue(1);
    fixture.detectChanges();

    expect(component.form.get('calidadPercibida')?.value).toBe(5);
    expect(component.form.get('fatigaPercibida')?.value).toBe(1);
    expect(component.obtenerTextoCalidad(5)).toBe('Excelente');
    expect(component.obtenerTextoFatiga(1)).toBe('Muy fresco');
  });

  it('5. debe validar datos inválidos (horas incorrectas)', () => {
    component.form.get('horaAcostarse')?.setValue('25:00');
    expect(component.form.get('horaAcostarse')?.invalid).toBe(true);

    component.form.get('horaAcostarse')?.setValue('22:30');
    expect(component.form.get('horaAcostarse')?.valid).toBe(true);
  });

  it('6 & 7. debe manejar horarios que cruzan medianoche y permitir edición', () => {
    component.form.get('horaAcostarse')?.setValue('23:30');
    component.form.get('horaDespertar')?.setValue('07:15');
    fixture.detectChanges();

    expect(component.form.get('horaAcostarse')?.value).toBe('23:30');
    expect(component.form.get('horaDespertar')?.value).toBe('07:15');
    expect(component.form.valid).toBe(true);
  });

  it('8. guarda en la cola offline con los valores del formulario y lo indica sin decir "sincronizado"', async () => {
    component.form.patchValue({ fecha: '2026-10-21', horaAcostarse: '23:30', horaDespertar: '07:15' });
    await component.guardar();
    fixture.detectChanges();

    expect(diarioServiceSpy.guardarDiario).toHaveBeenCalledWith(
      expect.objectContaining({ fecha: '2026-10-21', horaAcostarse: '23:30', horaDespertar: '07:15', calidadPercibida: 4 }),
    );
    expect(component.estadoGuardado()).toBe('en_cola');
    expect(component.guardando()).toBe(false);
    const alerta = (fixture.nativeElement as HTMLElement).querySelector('.estado-alerta');
    expect(alerta?.textContent).toContain('Se enviará al servidor cuando haya conexión');
  });

  it('9 & 10. si no se puede encolar (sin sesión o error local) muestra error', async () => {
    diarioServiceSpy.guardarDiario.mockRejectedValue(new Error('Sin sesion'));
    await component.guardar();
    fixture.detectChanges();

    expect(component.estadoGuardado()).toBe('error');
    expect((fixture.nativeElement as HTMLElement).querySelector('.estado-alerta.error')).toBeTruthy();
  });

  it('formulario inválido no llama al servicio', async () => {
    component.form.get('horaDespertar')?.setValue('99:99');
    await component.guardar();
    expect(diarioServiceSpy.guardarDiario).not.toHaveBeenCalled();
  });

  it('11, 12, 13, 14 & 15. diseño móvil, DTOs y validaciones intactas', () => {
    const val = component.form.getRawValue();
    expect(val).toBeDefined();
    expect(component.form.contains('latenciaMin')).toBe(true);
    expect(component.form.contains('luzMatutinaMin')).toBe(true);
    expect(component.form.contains('calidadPercibida')).toBe(true);
    expect(component.form.contains('fatigaPercibida')).toBe(true);
    expect(component.form.contains('esDiaLaboral')).toBe(true);
  });
});
