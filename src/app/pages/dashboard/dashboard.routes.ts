import { Routes } from '@angular/router';
import { Roles } from '../../shared/enums/roles';

export const dashboardRoutes: Routes = [
  {
    path: 'resumen',
    loadComponent: () => import('./resumen/resumen.component').then(m => m.ResumenComponent),
    data: { requiredAccess: [Roles.SuperAdmin, Roles.Operario, Roles.Supervisor, Roles.Administrativo] }
  }
];
