import { Routes } from '@angular/router';

export const planFacturacionRoutes: Routes = [
  {
    path: 'visor',
    loadComponent: () => import('./visor-plan-facturacion/visor-plan-facturacion.component').then(m => m.VisorPlanFacturacionComponent)
  },
];
