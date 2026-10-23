import { By } from '@angular/platform-browser';
import { FormGroupDirective } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { DespachoAptitudComponent } from './despacho-aptitud.component';
import { AptitudService } from '../aptitud/aptitud.service';
import { of, throwError } from 'rxjs';

describe('DespachoAptitudComponent', () => {
  let component: DespachoAptitudComponent;
  let fixture: ComponentFixture<DespachoAptitudComponent>;
  let aptitudServiceSpy: { consultarDespacho: jest.Mock };

  beforeEach(async () => {
    aptitudServiceSpy = { consultarDespacho: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [DespachoAptitudComponent],
      providers: [{ provide: AptitudService, useValue: aptitudServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DespachoAptitudComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  function formulario() { return fixture.debugElement.query(By.directive(FormGroupDirective)).injector.get(FormGroupDirective).form; }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form validation', () => {
    it('should require codigo (fecha has default value)', () => {
      expect(formulario().get('codigo')?.invalid).toBe(true);
      expect(formulario().get('fecha')?.valid).toBe(true); // fecha has default value
    });

    it('should be valid when codigo is filled', () => {
      formulario().patchValue({ codigo: 'T-123' });
      expect(formulario().valid).toBe(true);
    });
  });

  describe('consultar', () => {
    it('should call consultarDespacho with correct params and display results', async () => {
      const mockResponse = {
        evaluaciones: [
          { codigo: 'CON-001', color: 'verde' as const },
          { codigo: 'CON-002', color: 'rojo' as const },
        ],
      };
      aptitudServiceSpy.consultarDespacho.mockReturnValue(of(mockResponse));

      formulario().patchValue({ codigo: 'T-789', fecha: '2025-01-15' });
      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit');
      await fixture.whenStable();
      fixture.detectChanges();

      expect(aptitudServiceSpy.consultarDespacho).toHaveBeenCalledWith({
        codigo: 'T-789',
        fecha: '2025-01-15',
      });
      expect(fixture.nativeElement.textContent).toContain('CON-001');
      expect(fixture.nativeElement.querySelector('[role=list], [role=status]')).not.toBeNull();
    });

    it('should display empty state when no evaluations', async () => {
      const mockResponse = { evaluaciones: [] };
      aptitudServiceSpy.consultarDespacho.mockReturnValue(of(mockResponse));

      formulario().patchValue({ codigo: 'T-999', fecha: '2025-01-16' });
      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit');
      await fixture.whenStable();
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('No hay evaluaciones');
      expect(fixture.nativeElement.querySelector('[role=list], [role=status]')).not.toBeNull();
    });

    it('should handle network error', async () => {
      aptitudServiceSpy.consultarDespacho.mockReturnValue(throwError(() => ({ status: 0 })));

      formulario().patchValue({ codigo: 'T-111', fecha: '2025-01-17' });
      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit');
      await fixture.whenStable();
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('conexión');
      expect(fixture.debugElement.query(By.css('button')).nativeElement.disabled).toBe(false);
    });

    it('should handle 403 forbidden', async () => {
      aptitudServiceSpy.consultarDespacho.mockReturnValue(throwError(() => ({ status: 403 })));

      formulario().patchValue({ codigo: 'T-222', fecha: '2025-01-18' });
      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit');
      await fixture.whenStable();
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('permiso de despachador');
    });
  });
});
