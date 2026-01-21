import { Routes } from '@angular/router';

export const notificacionesRoutes: Routes = [
  {
    path: 'visor',
    loadComponent: () => import('./visor-notificaciones/visor-notificaciones.component').then(m => m.VisorNotificacionesComponent)
  },
];
