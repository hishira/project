import { Routes } from '@angular/router';

export const OFFERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./offer-list/offer-list.component').then(c => c.OfferListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./offer-edit/offer-edit.component').then(c => c.OfferEditComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./offer-detail/offer-detail.component').then(c => c.OfferDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./offer-edit/offer-edit.component').then(c => c.OfferEditComponent)
  }
];