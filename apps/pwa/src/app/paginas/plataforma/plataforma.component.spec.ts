import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SesionService } from '../../auth/sesion.service';
import { crearJwtPrueba } from '../../auth/token-prueba';
import { PlataformaComponent } from './plataforma.component';

describe('PlataformaComponent: exportacion RF16', () => {
  function montar(rol: string) {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    TestBed.inject(SesionService).iniciar({
      accessToken: crearJwtPrueba({ sub: 'u1', rol, codigoParticipante: 'A01' }),
      refreshToken: crearJwtPrueba({ sub: 'u1', tipo: 'refresco' }),
      expiraEnSegundos: 60,
    });
    const fixture = TestBed.createComponent(PlataformaComponent);
    fixture.detectChanges();
    return { fixture, backend: TestBed.inject(HttpTestingController) };
  }

  it('solo el administrador ve el boton', () => {
    const { fixture } = montar('trabajador');
    expect(fixture.nativeElement.textContent).not.toContain('Exportar indicadores');
  });

  it('con menos de 5 participantes explica el motivo (409)', async () => {
    const { fixture, backend } = montar('administrador');
    const boton = [...fixture.nativeElement.querySelectorAll('button')].find((b: HTMLButtonElement) =>
      b.textContent?.includes('Exportar'),
    ) as HTMLButtonElement;
    boton.click();
    backend
      .expectOne(`${environment.apiUrl}/admin/export/indicadores.csv`)
      .flush(new Blob(['{}']), { status: 409, statusText: 'Conflict' });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role=status]').textContent).toContain('5 participantes');
  });
});
