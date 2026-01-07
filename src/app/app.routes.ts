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
      import('./pages/auth/login.routes').then((m) => m.loginRoutes),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.routes').then(
        (m) => m.dashboardRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'propiedades',
    loadChildren: () =>
      import('./pages/propiedades/propiedades.routes').then(
        (m) => m.propiedadesRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'leads',
    loadChildren: () =>
      import('./pages/leads/leads.routes').then(
        (m) => m.leadsRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'agenda',
    loadChildren: () =>
      import('./pages/agenda/agenda.routes').then(
        (m) => m.agendaRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'clientes',
    loadChildren: () =>
      import('./pages/clientes/clientes.routes').then(
        (m) => m.clientesRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'operaciones',
    loadChildren: () =>
      import('./pages/operaciones/operaciones.routes').then(
        (m) => m.operacionesRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'equipo',
    loadChildren: () =>
      import('./pages/equipo/equipo.routes').then(
        (m) => m.equipoRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'inmobiliaria',
    loadChildren: () =>
      import('./pages/inmobiliaria/inmobiliaria.routes').then(
        (m) => m.inmobiliariaRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'plan-facturacion',
    loadChildren: () =>
      import('./pages/plan-facturacion/plan-facturacion.routes').then(
        (m) => m.planFacturacionRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'reportes',
    loadChildren: () =>
      import('./pages/reportes/reportes.routes').then(
        (m) => m.reportesRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'configuracion',
    loadChildren: () =>
      import('./pages/configuracion/configuracion.routes').then(
        (m) => m.configuracionRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'notificaciones',
    loadChildren: () =>
      import('./pages/notificaciones/notificaciones.routes').then(
        (m) => m.notificacionesRoutes
      ),
    canActivate: [authGuard],
  },
  {
    path: 'integraciones',
    loadChildren: () =>
      import('./pages/integraciones/integraciones.routes').then(
        (m) => m.integracionesRoutes
      ),
    canActivate: [authGuard],
  }
];