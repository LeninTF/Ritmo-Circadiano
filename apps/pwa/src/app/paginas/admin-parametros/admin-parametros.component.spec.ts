import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AdminParametrosComponent } from './admin-parametros.component';

const url = `${environment.apiUrl}/admin/parametros`;

describe('AdminParametrosComponent', () => {
  it('carga los parametros, guarda un valor y muestra el error 400 del servidor', async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const backend = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(AdminParametrosComponent);
    backend.expectOne(url).flush([{ clave: 'umbral_cafeina_mg', valor: '50', descripcion: 'Umbral' }]);
    await fixture.whenStable();
    const raiz: HTMLElement = fixture.nativeElement;
    const campo = raiz.querySelector('input') as HTMLInputElement;
    expect(campo.value).toBe('50');

    campo.value = '40';
    (raiz.querySelector('button[type=submit]') as HTMLButtonElement).click();
    const put = backend.expectOne(`${url}/umbral_cafeina_mg`);
    expect(put.request.body).toEqual({ valor: '40' });
    put.flush({ clave: 'umbral_cafeina_mg', valor: '40', descripcion: 'Umbral' });
    await fixture.whenStable();
    expect(raiz.querySelector('[role=status]')?.textContent).toContain('umbral_cafeina_mg = 40');

    (raiz.querySelector('button[type=submit]') as HTMLButtonElement).click();
    backend
      .expectOne(`${url}/umbral_cafeina_mg`)
      .flush({ message: 'El valor debe ser un numero entre 0 y 400' }, { status: 400, statusText: 'Bad Request' });
    await fixture.whenStable();
    expect(raiz.querySelector('[role=alert]')?.textContent).toContain('entre 0 y 400');
    backend.verify();
  });
});
