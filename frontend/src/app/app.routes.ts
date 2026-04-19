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
        path: 'integrations',
        loadChildren: () => import('./features/integration/integration.routes').then(m => m.INTEGRATIONS_ROUTES)
      },
      {
        path: 'invoices',
        loadChildren: () => import('./features/invoice/invoice.routes').then(m => m.INVOICES_ROUTES)
      },
      {
        path: 'loyalty',
        loadChildren: () => import('./features/loyalty/loyalty.routes').then(m => m.LOYALTY_ROUTES)
      },
      {
        path: 'offers',
        loadChildren: () => import('./features/offer/offer.routes').then(m => m.OFFERS_ROUTES)
      },
      {
        path: 'import-export',
        loadChildren: () => import('./features/import-export/import-export.routes').then(m => m.IMPORT_EXPORT_ROUTES),
        canActivate: [authGuard],
      },
      {
        path: 'social',
        loadChildren: () => import('./features/social/social.routes').then(m => m.SOCIAL_ROUTES)
      },
      {
        path: 'audit',
        loadChildren: () => import('./features/audit/audit.routes').then(m => m.AUDIT_ROUTES),
        canActivate: [authGuard],
      },
      {
        path: 'onboarding',
        loadChildren: () => import('./features/onboarding/onboarding.routes').then(m => m.ONBOARDING_ROUTES)
      },
      {
        path: 'analytics',
        loadChildren: () => import('./features/report/analytics.routes').then(m => m.ANALYTICS_ROUTES)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./features/notifications/notifications.routes').then(m => m.NOTIFICATIONS_ROUTES),
        canActivate: [authGuard],
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
