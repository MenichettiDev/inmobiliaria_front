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
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'propiedades',
    children: [
      {
        path: '',
        redirectTo: 'listado',
        pathMatch: 'full'
      },
      {
        path: 'listado',
        loadComponent: () => import('./pages/propiedades/propiedades-listado.component').then(m => m.PropiedadesListadoComponent),
        canActivate: [authGuard]
      },
      {
        path: 'crear',
        loadComponent: () => import('./pages/propiedades/propiedades-listado.component').then(m => m.PropiedadesListadoComponent),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'leads',
    children: [
      {
        path: '',
        redirectTo: 'listado',
        pathMatch: 'full'
      },
      {
        path: 'listado',
        loadComponent: () => import('./pages/leads/leads-listado.component').then(m => m.LeadsListadoComponent),
        canActivate: [authGuard]
      },
      {
        path: 'crear',
        loadComponent: () => import('./pages/leads/leads-listado.component').then(m => m.LeadsListadoComponent),
        canActivate: [authGuard]
      },
      {
        path: 'mis-leads',
        loadComponent: () => import('./pages/leads/leads-listado.component').then(m => m.LeadsListadoComponent),
        canActivate: [authGuard]
      },
      {
        path: 'asignados',
        loadComponent: () => import('./pages/leads/leads-listado.component').then(m => m.LeadsListadoComponent),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'agenda',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/agenda/agenda.component').then(m => m.AgendaComponent),
        canActivate: [authGuard]
      },
      {
        path: 'crear-visita',
        loadComponent: () => import('./pages/agenda/agenda.component').then(m => m.AgendaComponent),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'clientes',
    loadComponent: () => import('./pages/clientes/clientes-listado.component').then(m => m.ClientesListadoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'operaciones',
    loadComponent: () => import('./pages/operaciones/operaciones-listado.component').then(m => m.OperacionesListadoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'equipo',
    loadComponent: () => import('./pages/equipo/equipo-listado.component').then(m => m.EquipoListadoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'inmobiliaria',
    children: [
      {
        path: '',
        redirectTo: 'datos',
        pathMatch: 'full'
      },
      {
        path: 'datos',
        loadComponent: () => import('./pages/inmobiliaria/inmobiliaria-datos.component').then(m => m.InmobiliariaDatosComponent),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'plan-facturacion',
    loadComponent: () => import('./pages/plan-facturacion/plan-facturacion.component').then(m => m.PlanFacturacionComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reportes',
    loadComponent: () => import('./pages/reportes/reportes.component').then(m => m.ReportesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./pages/configuracion/configuracion.component').then(m => m.ConfiguracionComponent),
    canActivate: [authGuard]
  },
  {
    path: 'notificaciones',
    loadComponent: () => import('./pages/notificaciones/notificaciones.component').then(m => m.NotificacionesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'integraciones',
    loadComponent: () => import('./pages/integraciones/integraciones.component').then(m => m.IntegracionesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'ayuda',
    loadComponent: () => import('./pages/ayuda/ayuda.component').then(m => m.AyudaComponent),
    canActivate: [authGuard]
  },
  {
    path: 'gestion-saas',
    children: [
      {
        path: '',
        redirectTo: 'inmobiliarias',
        pathMatch: 'full'
      },
      {
        path: 'inmobiliarias',
        loadComponent: () => import('./pages/gestion-saas/gestion-saas-inmobiliarias.component').then(m => m.GestionSaasInmobiliariasComponent),
        canActivate: [authGuard]
      },
      {
        path: 'planes',
        loadComponent: () => import('./pages/gestion-saas/gestion-saas-planes.component').then(m => m.GestionSaasPlanesComponent),
        canActivate: [authGuard]
      },
      {
        path: 'metricas',
        loadComponent: () => import('./pages/gestion-saas/gestion-saas-metricas.component').then(m => m.GestionSaasMetricasComponent),
        canActivate: [authGuard]
      },
      {
        path: 'logs',
        loadComponent: () => import('./pages/gestion-saas/gestion-saas-logs.component').then(m => m.GestionSaasLogsComponent),
        canActivate: [authGuard]
      }
    ]
  }
];