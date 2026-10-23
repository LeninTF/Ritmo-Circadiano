import { Route } from '@angular/router';
import { autenticadoGuard, rolGuard } from './auth/auth.guards';
import { consentimientoGuard } from './auth/flujo-registro.service';

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
    path: 'consentimiento',
    loadComponent: () =>
      import('./auth/consentimiento.component').then(
        (m) => m.ConsentimientoComponent,
      ),
  },
  {
    path: 'registro',
    canActivate: [consentimientoGuard],
    loadComponent: () =>
      import('./auth/registro.component').then((m) => m.RegistroComponent),
  },
  {
    path: 'ingresar',
    loadComponent: () =>
      import('./auth/ingresar.component').then((m) => m.IngresarComponent),
  },
  {
    path: 'turnos',
    canActivate: [autenticadoGuard],
    loadComponent: () =>
      import('./paginas/turnos/turnos.component').then(
        (m) => m.TurnosComponent,
      ),
  },
  {
    path: 'indicadores',
    canActivate: [rolGuard('jefe_operaciones')],
    loadComponent: () =>
      import('./paginas/indicadores/indicadores.component').then(
        (m) => m.IndicadoresComponent,
      ),
  },
  {
    path: 'admin/parametros',
    canActivate: [rolGuard('administrador')],
    loadComponent: () =>
      import('./paginas/admin-parametros/admin-parametros.component').then(
        (m) => m.AdminParametrosComponent,
      ),
  },
  {
    path: 'plan',
    canActivate: [autenticadoGuard],
    loadComponent: () =>
      import('./paginas/plan/plan.component').then((m) => m.PlanComponent),
  },
  {
    path: 'cafeina',
    canActivate: [autenticadoGuard],
    loadComponent: () =>
      import('./paginas/cafeina/cafeina.component').then(
        (m) => m.CafeinaComponent,
      ),
  },
  {
    path: 'aptitud',
    canActivate: [autenticadoGuard],
    loadComponent: () =>
      import('./paginas/aptitud/aptitud.component').then(
        (m) => m.AptitudComponent,
      ),
  },
  {
    path: 'diario',
    canActivate: [autenticadoGuard],
    loadComponent: () =>
      import('./paginas/diario/diario.component').then(
        (m) => m.DiarioComponent,
      ),
  },
];
