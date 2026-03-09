import { Routes } from '@angular/router';

export const LOYALTY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./loyalty-list/loyalty-list.component').then(c => c.LoyaltyListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./loyalty-detail/loyalty-detail.component').then(c => c.LoyaltyDetailComponent)
  }
];