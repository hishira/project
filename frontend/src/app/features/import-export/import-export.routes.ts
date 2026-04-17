import { Routes } from '@angular/router';

export const IMPORT_EXPORT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () => import('./export-list/export-list.component').then((c) => c.ExportListComponent),
  },
  {
    path: 'details/:id',
    loadComponent: () => import('./export-detail/export-detail.component').then((c) => c.ExportDetailComponent),
  },
];
