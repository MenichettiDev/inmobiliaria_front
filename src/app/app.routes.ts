import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { webAuthGuard } from './guards/web-auth.guard';
import { PublicLayoutComponent } from './views/public/public-layout/public-layout.component';
import { PublicPropiedadesComponent } from './views/public/public-propiedades/public-propiedades.component';
import { PublicPropiedadDetalleComponent } from './views/public/public-propiedad-detalle/public-propiedad-detalle.component';
import { PublicFavoritosComponent } from './views/public/public-favoritos/public-favoritos.component';
import { PublicMisConsultasComponent } from './views/public/public-mis-consultas/public-mis-consultas.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/portal',
    pathMatch: 'full',
  },
  // RUTAS PÚBLICAS
  {
    path: 'portal',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        component: PublicPropiedadesComponent,
      },
      {
        path: 'propiedades',
        component: PublicPropiedadesComponent,
      },
      {
        path: 'propiedades/:id',
        component: PublicPropiedadDetalleComponent,
      },
      {
        path: 'favoritos',
        component: PublicFavoritosComponent,
        canActivate: [webAuthGuard],
      },
      {
        path: 'consultas',
        component: PublicMisConsultasComponent,
        canActivate: [webAuthGuard],
      },
    ],
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
    path: 'usuarios',
    loadChildren: () =>
      import('./views/usuario/user.routes').then(
        (m) => m.userRoutes
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