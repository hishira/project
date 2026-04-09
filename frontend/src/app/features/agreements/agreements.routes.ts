import { Routes } from "@angular/router";

export const agreementsRoutes: Routes = [
    {
        path: 'details/:id',
        loadComponent:
            () => import('./agreement-details/agreement-details.component').then(c => c.AgreementDetailsComponent),
    }
]