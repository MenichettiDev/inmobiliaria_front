import { Routes } from '@angular/router';
import { Roles } from '../../shared/enums/roles';

export const userRoutes: Routes = [
  {
    path: '',
    redirectTo: 'visor',
    pathMatch: 'full',
  },
  {
    path: 'visor',
    loadComponent: () =>
      import('./visor-usuario/visor-usuario.component').then((m) => m.VisorUsuariosComponent),
    data: {
      requiredAccess: [
        Roles.SuperAdmin,
        Roles.Operario,
        Roles.Supervisor,
        Roles.Administrativo,
      ],
    },
  },

];
