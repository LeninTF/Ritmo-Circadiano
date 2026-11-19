import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { SesionService } from '../../auth/sesion.service';
import { OfflineStoreService } from '../../core/offline/offline-store.service';
import { MenuCuentaComponent } from './menu-cuenta.component';

describe('MenuCuentaComponent', () => {
  const auth = { cerrarSesion: jest.fn().mockResolvedValue(undefined) };
  const router = { navigate: jest.fn().mockResolvedValue(true) };
  const offline = { getPendingOutbox: jest.fn() };

  function crear(autenticada = true) {
    TestBed.configureTestingModule({
      imports: [MenuCuentaComponent],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router },
        { provide: OfflineStoreService, useValue: offline },
        {
          provide: SesionService,
          useValue: { estaAutenticada: () => autenticada, codigoParticipante: signal('J01'), rol: signal('jefe_operaciones') },
        },
      ],
    });
    const fixture = TestBed.createComponent(MenuCuentaComponent);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  const botones = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLButtonElement>('.hoja button'));
  const pulsar = (el: HTMLElement, texto: string) => botones(el).find((b) => b.textContent?.trim() === texto)?.click();

  beforeEach(() => jest.clearAllMocks());

  it('sin sesión no muestra el botón', () => {
    expect(crear(false).el.querySelector('.boton-cuenta')).toBeNull();
  });

  it('abre la hoja con código y rol; cerrar sesión pide confirmación antes de salir', async () => {
    offline.getPendingOutbox.mockResolvedValue([]);
    const { fixture, el } = crear();
    el.querySelector<HTMLButtonElement>('[aria-label="Mi cuenta"]')?.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(el.querySelector('[role=dialog]')?.textContent).toContain('J01');
    expect(el.textContent).toContain('Jefe de operaciones');
    expect(el.querySelector('.aviso')).toBeNull();

    pulsar(el, 'Cerrar sesión');
    fixture.detectChanges();
    expect(auth.cerrarSesion).not.toHaveBeenCalled();

    pulsar(el, 'Sí, cerrar sesión');
    await fixture.whenStable();
    expect(auth.cerrarSesion).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/ingresar']);
  });

  it('avisa si hay registros sin sincronizar en el outbox', async () => {
    offline.getPendingOutbox.mockResolvedValue([{}, {}]);
    const { fixture, el } = crear();
    el.querySelector<HTMLButtonElement>('.boton-cuenta')?.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(el.querySelector('.aviso')?.textContent).toContain('2 registros sin sincronizar');
  });
});
