import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { appRoutes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('muestra las cuatro pestañas del Figma', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const textos = Array.from<HTMLElement>(
      fixture.nativeElement.querySelectorAll('nav a'),
    ).map((a) => a.textContent?.trim());
    expect(textos).toEqual(['Hoy', 'Cafeína', 'Pre-salida', 'Diario']);
  });

  it('mantiene accesibles por URL turnos e indicadores', () => {
    const rutas = appRoutes.map((r) => r.path);
    expect(rutas).toEqual(expect.arrayContaining(['turnos', 'indicadores', 'aptitud']));
  });
});
