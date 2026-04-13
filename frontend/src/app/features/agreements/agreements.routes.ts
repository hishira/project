import { Routes } from "@angular/router";

export const agreementsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./agreement-list/agreement-list.component').then(m => m.AgreementListComponent)
    },
    {
        path: 'details/:id',
        loadComponent: () => import('./agreement-details/agreement-details.component').then(c => c.AgreementDetailsComponent),
    }
]