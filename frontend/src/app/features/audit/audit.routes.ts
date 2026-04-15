import { Routes } from '@angular/router';

export const AUDIT_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./audit-list/audit-list.component').then(c => c.AuditListComponent),
    },
    {
        path: ':id',
        loadComponent: () => import('./audit-detail/audit-detail.component').then(c => c.AuditDetailComponent),
    },
];
