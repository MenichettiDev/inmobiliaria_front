import { Routes } from '@angular/router';

export const operacionesRoutes: Routes = [
  {
    path: 'visor',
    loadComponent: () => import('./pages/visor-operaciones/visor-operaciones.component').then(m => m.VisorOperacionesComponent)
  },
];
