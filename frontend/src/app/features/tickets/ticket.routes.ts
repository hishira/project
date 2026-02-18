import { Routes } from "@angular/router";

export const ticketRoutes: Routes = [
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    },
    {
        path: 'list',
        loadComponent: () => import('./ticket-list/ticket-list.component').then(c => c.TicketListComponent),
    },
    {
        path: 'details/:id',
        loadComponent: () => import('./ticket-details/ticket-details.component').then(c => c.TicketDetailComponent),
    }
]