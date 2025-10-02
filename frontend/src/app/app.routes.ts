import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/components/app-layout/app-layout.component').then(
        (m) => m.AppLayoutComponent
      ),
    children: [
      {
        path: "**",
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        pathMatch: 'full',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(
            (m) => m.dashboardRoutes
          ),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },

  {
    path: 'activities',
    loadChildren: () =>
      import('./features/activities/activities.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  {
    path: 'statistics',
    loadChildren: () =>
      import('./features/statistics/statistics.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
