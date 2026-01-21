import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./views/auth/login.routes').then((m) => m.loginRoutes),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./views/dashboard/dashboard.routes').then(
        (m) => m.dashboardRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'propiedades',
    loadChildren: () =>
      import('./views/propiedades/propiedades.routes').then(
        (m) => m.propiedadesRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'leads',
    loadChildren: () =>
      import('./views/leads/leads.routes').then(
        (m) => m.leadsRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'agenda',
    loadChildren: () =>
      import('./views/agenda/agenda.routes').then(
        (m) => m.agendaRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'clientes',
    loadChildren: () =>
      import('./views/clientes/clientes.routes').then(
        (m) => m.clientesRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'operaciones',
    loadChildren: () =>
      import('./views/operaciones/operaciones.routes').then(
        (m) => m.operacionesRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'equipo',
    loadChildren: () =>
      import('./views/equipo/equipo.routes').then(
        (m) => m.equipoRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'inmobiliaria',
    loadChildren: () =>
      import('./views/inmobiliaria/inmobiliaria.routes').then(
        (m) => m.inmobiliariaRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'plan-facturacion',
    loadChildren: () =>
      import('./views/plan-facturacion/plan-facturacion.routes').then(
        (m) => m.planFacturacionRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'reportes',
    loadChildren: () =>
      import('./views/reportes/reportes.routes').then(
        (m) => m.reportesRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'configuracion',
    loadChildren: () =>
      import('./views/configuracion/configuracion.routes').then(
        (m) => m.configuracionRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'notificaciones',
    loadChildren: () =>
      import('./views/notificaciones/notificaciones.routes').then(
        (m) => m.notificacionesRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'integraciones',
    loadChildren: () =>
      import('./views/integraciones/integraciones.routes').then(
        (m) => m.integracionesRoutes
      ),
    canActivate: [authGuard],
  }
];