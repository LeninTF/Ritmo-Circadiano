import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SemaforoAptitudComponent } from '../../compartido/semaforo-aptitud/semaforo-aptitud.component';
import { TarjetaComponent } from '../../compartido/tarjeta/tarjeta.component';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { AptitudComponent } from './aptitud.component';
import { AptitudService } from './aptitud.service';
import { SesionService } from '../../auth/sesion.service';
import { Router } from '@angular/router';
import type { CrearAptitudResponse } from '@circadiano/contracts';
import { of, throwError } from 'rxjs';

@Component({ selector: 'app-aptitud-prueba', standalone: true, templateUrl: './aptitud.component.html', imports: [CommonModule, ReactiveFormsModule, SemaforoAptitudComponent, TarjetaComponent] })
class AptitudPruebaComponent extends AptitudComponent {
  turnoId: string | null = 'turno-test-123';
  protected override obtenerTurnoIdDelDia(): string | null { return this.turnoId; }
  getFormulario() { return this.formulario; }
  getPasoActual() { return this.pasoActual(); }
  getPasos() { return this.pasos(); }
  getResultadoColor() { return this.resultadoColor(); }
  getMotivos() { return this.motivos(); }
  getErrorEnvio() { return this.errorEnvio(); }
  getEnviando() { return this.enviando(); }
  override siguientePaso() { super.siguientePaso(); }
  override enviarAutoevaluacion() { return super.enviarAutoevaluacion(); }
  override puedeAvanzarAPaso(id: 'datos' | 'autorreporte' | 'resultado') { return super.puedeAvanzarAPaso(id); }
  override reiniciar() { super.reiniciar(); }
}

describe('AptitudComponent', () => {
  let component: AptitudPruebaComponent;
  let fixture: ComponentFixture<AptitudPruebaComponent>;
  let aptitudServiceSpy: { crearAptitud: jest.Mock };
  let sesionServiceSpy: { cerrar: jest.Mock };
  let routerSpy: { navigate: jest.Mock };

  beforeEach(async () => {
    aptitudServiceSpy = { crearAptitud: jest.fn() };
    sesionServiceSpy = { cerrar: jest.fn() };
    routerSpy = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [AptitudPruebaComponent],
      providers: [
        { provide: AptitudService, useValue: aptitudServiceSpy },
        { provide: SesionService, useValue: sesionServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AptitudPruebaComponent);

    component = fixture.componentInstance;
    component.turnoId = 'turno-test-123';

    // Mock obtenerTurnoIdDelDia to return a valid ID for service interaction tests


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form validation', () => {
    it('should have somnolencia required and between 1-5', () => {
      const control = component.getFormulario().get('somnolencia');
      expect(control).toBeTruthy();

      control?.setValue(null);
      expect(control?.invalid).toBe(true);

      control?.setValue(0);
      expect(control?.invalid).toBe(true);

      control?.setValue(6);
      expect(control?.invalid).toBe(true);

      control?.setValue(3);
      expect(control?.valid).toBe(true);
    });

    it('should have compartido default to false', () => {
      component.siguientePaso(); fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#compartido')).nativeElement.checked).toBe(false);
    });
  });

  describe('consent toggle logic', () => {
    it('should allow toggling compartido checkbox', () => {
      // Advance to autorreporte step where the checkbox is rendered
      component.siguientePaso();
      fixture.detectChanges();

      const checkbox = fixture.debugElement.nativeElement.querySelector('#compartido');
      expect(checkbox).toBeTruthy();

      // Initially unchecked
      expect(fixture.debugElement.query(By.css('#compartido')).nativeElement.checked).toBe(false);

      // Click to check
      checkbox.click();
      fixture.detectChanges();
      expect(checkbox.checked).toBe(true);
    });
  });

  describe('service interaction', () => {
    it('should call crearAptitud with correct parameters and navigate to resultado on success', async () => {
      const mockResponse: CrearAptitudResponse = { color: 'verde' };
      // Return an Observable that has toPromise() method
      aptitudServiceSpy.crearAptitud.mockReturnValue(of(mockResponse));

      // Set somnolencia to valid value
      component.getFormulario().patchValue({ somnolencia: 2, compartido: false });

      await component.enviarAutoevaluacion();
      await fixture.whenStable();

      expect(aptitudServiceSpy.crearAptitud).toHaveBeenCalledWith('turno-test-123', {
        somnolencia: 2,
        compartido: false,
      });
      expect(component.getResultadoColor()).toBe('verde');
      expect(component.getPasoActual()).toBe('resultado');
    });

    it('should handle network error gracefully', async () => {
      aptitudServiceSpy.crearAptitud.mockReturnValue(throwError(() => ({ status: 0 })));

      component.getFormulario().patchValue({ somnolencia: 3, compartido: true });
      await component.enviarAutoevaluacion();
      await fixture.whenStable();

      expect(component.getErrorEnvio()).toContain('conexión');
      expect(component.getEnviando()).toBe(false);
    });

    it('should handle 401 by logging out and redirecting', async () => {
      aptitudServiceSpy.crearAptitud.mockReturnValue(throwError(() => ({ status: 401 })));

      component.getFormulario().patchValue({ somnolencia: 3, compartido: false });
      await component.enviarAutoevaluacion();
      await fixture.whenStable();

      expect(sesionServiceSpy.cerrar).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/ingresar'], {
        queryParams: { retorno: '/aptitud' },
      });
    });

    it('should handle 409 conflict', async () => {
      aptitudServiceSpy.crearAptitud.mockReturnValue(throwError(() => ({ status: 409 })));

      component.getFormulario().patchValue({ somnolencia: 3, compartido: false });
      await component.enviarAutoevaluacion();
      await fixture.whenStable();

      expect(component.getErrorEnvio()).toContain('Ya existe una evaluación');
    });
  });

  describe('turnoId validation', () => {
    it('should show error when no active turno for today', async () => {
      // Override mock to return null (no turno)
      component.turnoId = null;

      component.getFormulario().patchValue({ somnolencia: 3, compartido: false });
      await component.enviarAutoevaluacion();
      await fixture.whenStable();

      expect(component.getErrorEnvio()).toContain('No hay un turno activo');
      expect(component.getEnviando()).toBe(false);
      expect(aptitudServiceSpy.crearAptitud).not.toHaveBeenCalled();
    });
  });

  describe('step navigation', () => {
    it('should start at datos step', () => {
      expect(component.getPasoActual()).toBe('datos');
    });

    it('should advance to autorreporte after completing datos', () => {
      component.siguientePaso();
      expect(component.getPasoActual()).toBe('autorreporte');
      expect(component.getPasos()[0].completado).toBe(true);
    });

    it('should not allow skipping steps', () => {
      expect(component.puedeAvanzarAPaso('resultado')).toBe(false);
    });
  });

  describe('reiniciar', () => {
    it('should reset form and state', async () => {
      component.getFormulario().patchValue({ somnolencia: 4, compartido: true });
      await component.enviarAutoevaluacion();

      component.reiniciar();

      expect(component.getFormulario().get('somnolencia')?.value).toBeNull();
      component.siguientePaso(); fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#compartido')).nativeElement.checked).toBe(false);
      expect(component.getResultadoColor()).toBeNull();
      expect(component.getMotivos()).toEqual([]);
      expect(component.getPasoActual()).toBe('autorreporte');
    });
  });
});
