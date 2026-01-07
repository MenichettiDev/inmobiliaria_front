import { Routes } from '@angular/router';

export const ayudaRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./visor-ayuda/visor-ayuda.component').then(m => m.VisorAyudaComponent)
  },
];
