import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('muestra los enlaces de las cinco secciones', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const enlaces = fixture.nativeElement.querySelectorAll('nav a');
    expect(enlaces.length).toBe(5);
  });
});
