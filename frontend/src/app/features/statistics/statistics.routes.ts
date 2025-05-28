import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./statistics-dashboard/statistics-dashboard.component').then(m => m.StatisticsDashboardComponent)
  }
];
