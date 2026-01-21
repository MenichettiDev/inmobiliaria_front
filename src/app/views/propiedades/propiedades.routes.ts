import { Routes } from '@angular/router';

export const propiedadesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./visor-propiedades/visor-propiedades.component').then(m => m.VisorPropiedadesComponent)
  },
  {
    path: 'visor',
    loadComponent: () => import('./visor-propiedades/visor-propiedades.component').then(m => m.VisorPropiedadesComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./form-create-propiedad/form-create-propiedad.component').then(m => m.FormCreatePropiedadComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./form-edit-propiedad/form-edit-propiedad.component').then(m => m.FormEditPropiedadComponent)
  }
];
