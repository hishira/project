import { Routes } from "@angular/router";

export const raportRoutes: Routes = [
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    },
    {
        path: 'list',
        loadComponent: () => import('./raports-list/raports-list.component').then(c => c.ReportListComponent),
    },
    {
        path: 'details/:id',
        loadComponent: () => import('./raport-details/raport-details.component').then(c => c.ReportDetailComponent),
    }
]