import { Routes } from '@angular/router';

export const reportesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./visor-reportes/visor-reportes.component').then(m => m.VisorReportesComponent)
  },
];
