import { Routes } from '@angular/router';

export const configuracionRoutes: Routes = [
  {
    path: 'visor',
    loadComponent: () => import('./visor-configuracion/visor-configuracion.component').then(m => m.VisorConfiguracionComponent)
  },
];
