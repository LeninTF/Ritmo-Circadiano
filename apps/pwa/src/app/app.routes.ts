import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'plataforma' },
  {
    path: 'plataforma',
    loadComponent: () =>
      import('./paginas/plataforma/plataforma.component').then(
        (m) => m.PlataformaComponent,
      ),
  },
  {
    path: 'turnos',
    loadComponent: () =>
      import('./paginas/turnos/turnos.component').then(
        (m) => m.TurnosComponent,
      ),
  },
  {
    path: 'plan',
    loadComponent: () =>
      import('./paginas/plan/plan.component').then((m) => m.PlanComponent),
  },
  {
    path: 'cafeina',
    loadComponent: () =>
      import('./paginas/cafeina/cafeina.component').then(
        (m) => m.CafeinaComponent,
      ),
  },
  {
    path: 'diario',
    loadComponent: () =>
      import('./paginas/diario/diario.component').then(
        (m) => m.DiarioComponent,
      ),
  },
];
