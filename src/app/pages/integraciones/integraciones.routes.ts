import { Routes } from '@angular/router';

export const integracionesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./visor-integraciones/visor-integraciones.component').then(m => m.VisorIntegracionesComponent)
  },
];
