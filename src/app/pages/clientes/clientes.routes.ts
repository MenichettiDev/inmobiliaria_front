import { Routes } from '@angular/router';

export const clientesRoutes: Routes = [
  {
    path: 'visor',
    loadComponent: () => import('./visor-clientes/visor-clientes.component').then(m => m.VisorClientesComponent)
  },
];
