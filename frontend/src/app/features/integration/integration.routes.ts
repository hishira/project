import { Routes } from '@angular/router';

export const INTEGRATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./integration-list/integration-list.component').then(c => c.IntegrationListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./integration-detail/integration-detail.component').then(c => c.IntegrationDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./integration-edit/integration-edit.component').then(c => c.IntegrationEditComponent)
  }
];