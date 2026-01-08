import { Routes } from '@angular/router';

export const leadsRoutes: Routes = [
  {
    path: 'visor',
    loadComponent: () => import('./visor-leads/visor-leads.component').then(m => m.VisorLeadsComponent)
  },
];
