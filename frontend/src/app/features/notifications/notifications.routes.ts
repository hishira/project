import { Routes } from '@angular/router';

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () => import('./notifications-list/notifications-list.component').then((c) => c.NotificationsListComponent),
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./notifications-detail/notifications-detail.component').then((c) => c.NotificationsDetailComponent),
  },
  {
    path: 'config',
    loadComponent: () => import('./notifications-config/notifications-config.component').then((c) => c.NotificationsConfigComponent),
  },
];