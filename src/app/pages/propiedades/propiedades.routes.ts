import { Routes } from '@angular/router';

export const propiedadesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./visor-propiedades/visor-propiedades.component').then(m => m.VisorPropiedadesComponent)
  },
];
