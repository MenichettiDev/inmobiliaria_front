import { Routes } from '@angular/router';

export const clientesRoutes: Routes = [
  {
    path: 'visor',
    loadComponent: () => import('./pages/visor-clientes/visor-clientes.component').then(m => m.VisorClientesComponent)
  },
];
