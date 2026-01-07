import { Routes } from '@angular/router';

export const clientesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./visor-clientes/visor-clientes.component').then(m => m.VisorClientesComponent)
  },
];
