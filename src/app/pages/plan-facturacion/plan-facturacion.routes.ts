import { Routes } from '@angular/router';

export const planFacturacionRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./visor-plan-facturacion/visor-plan-facturacion.component').then(m => m.VisorPlanFacturacionComponent)
  },
];
