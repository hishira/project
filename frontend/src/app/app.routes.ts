import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },

  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/components/app-layout/app-layout.component').then(
        (m) => m.AppLayoutComponent
      ),
    children: [
      {
        path: 'dashboard',
        pathMatch: 'full',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(
            (m) => m.dashboardRoutes
          ),
        canActivate: [authGuard],
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./features/user-list/user-list-routes').then(
            (m) => m.userListRoutes
          ),
        canActivate: [authGuard],
      },
      {
        path: 'tickets',
        loadChildren: () => import('./features/tickets/ticket.routes').then(m => m.ticketRoutes)
      },
      {
        path: 'agreements',
        loadChildren: () => import('./features/agreements/agreements.routes').then(m => m.agreementsRoutes),
        canActivate: [authGuard]
      },
      {
        path: 'raports',
        loadChildren: () => import('./features/raports/raports-routes').then(m => m.raportRoutes),
      },
      {
        path: 'marketing',
        loadChildren: () => import('./features/marketing/marketing.routes').then(m => m.MARKETING_ROUTES)
      },
      {
        path: 'documents',
        loadChildren: () => import('./features/documents/documents.routes').then(m => m.DOCUMENTS_ROUTES)
      },
      {
        path: 'clients',
        loadChildren: () => import('./features/clients/clients.routes').then(m => m.CLIENTS_ROUTES),
      },
      {
        path: 'knowledge-base',
        loadChildren: () => import('./features/knowledge-base/knowledge-base.routes').then(m => m.KNOWLEDGE_BASE_ROUTES)
      },
      {
        path: 'tasks',
        loadChildren: () => import('./features/tasks/task.routes').then(m => m.TASKS_ROUTES)
      },
      {
        path: 'projects',
        loadChildren: () => import('./features/projects/project.routes').then(m => m.PROJECTS_ROUTES)
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
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
