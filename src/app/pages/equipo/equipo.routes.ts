import { Routes } from '@angular/router';

export const equipoRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./visor-equipo/visor-equipo.component').then(m => m.VisorEquipoComponent)
  },
];
