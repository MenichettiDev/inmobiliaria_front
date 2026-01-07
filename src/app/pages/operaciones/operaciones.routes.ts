import { Routes } from '@angular/router';

export const operacionesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./visor-operaciones/visor-operaciones.component').then(m => m.VisorOperacionesComponent)
  },
];
