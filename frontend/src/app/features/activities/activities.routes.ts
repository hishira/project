import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./activity-list/activity-list.component').then(m => m.ActivityListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./activity-form/activity-form.component').then(m => m.ActivityFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./activity-form/activity-form.component').then(m => m.ActivityFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./activity-detail/activity-detail.component').then(m => m.ActivityDetailComponent)
  }
];
