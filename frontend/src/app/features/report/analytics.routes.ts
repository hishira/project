import { Routes } from '@angular/router';

export const ANALYTICS_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./report-list/report-list.component').then(c => c.ReportListComponent)
  },
  {
    path: 'reports/builder',
    loadComponent: () => import('./report-builder/report-builder.component').then(c => c.ReportBuilderComponent)
  },
//   {
//     path: 'reports/:id',
//     loadComponent: () => import('./report-detail/report-detail.component').then(c => c.ReportDetailComponent)
//   },
  {
    path: 'predictions',
    loadComponent: () => import('./predictions/predictions.component').then(c => c.PredictionsComponent)
  }
];