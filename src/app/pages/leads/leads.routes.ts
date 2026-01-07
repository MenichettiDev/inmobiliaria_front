import { Routes } from '@angular/router';

export const leadsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./visor-leads/visor-leads.component').then(m => m.VisorLeadsComponent)
  },
];
