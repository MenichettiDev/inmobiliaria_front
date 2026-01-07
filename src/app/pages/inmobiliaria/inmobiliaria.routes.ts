import { Routes } from '@angular/router';

export const inmobiliariaRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./visor-inmobiliaria/visor-inmobiliaria.component').then(m => m.VisorInmobiliariaComponent)
  },
];
