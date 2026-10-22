import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { appRoutes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('muestra navegación accesible a las cinco secciones requeridas', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const navegacion = fixture.nativeElement.querySelector('nav');
    const enlaces = navegacion.querySelectorAll('a');
    expect(enlaces.length).toBe(5);
    expect(navegacion.getAttribute('aria-label')).toBe('Navegación principal');
    expect(Array.from(enlaces, (enlace: Element) => enlace.getAttribute('href'))).toEqual([
      '/plan', '/turnos', '/cafeina', '/diario', '/plataforma',
    ]);
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

  it('conserva router-outlet y ofrece un control de tema etiquetado', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('router-outlet')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('main#contenido-principal')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('button[aria-label="Activar modo oscuro"], button[aria-label="Activar modo claro"]')).not.toBeNull();
  });

  it('el toggle manual cambia el tema y persiste la preferencia', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('.boton-tema').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('data-tema')).toBe('oscuro');
    expect(localStorage.getItem('gestor-circadiano-tema')).toBe('oscuro');
    fixture.nativeElement.querySelector('.boton-tema').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('data-tema')).toBe('claro');
  });


});
