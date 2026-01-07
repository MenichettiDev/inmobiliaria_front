import { Routes } from '@angular/router';

export const agendaRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./visor-agenda/visor-agenda.component').then(m => m.VisorAgendaComponent)
  },
];
