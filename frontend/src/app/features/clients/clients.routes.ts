import { Routes } from "@angular/router";

export const CLIENTS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./client-list/client-list.component').then(c => c.ClientListComponent)
    },
    {
        path: ":id",
        loadComponent: () => import('./client-details/client-details.component').then(c => c.ClientDetailsComponent),
    },
]