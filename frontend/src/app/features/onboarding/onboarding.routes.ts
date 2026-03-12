import { Routes } from '@angular/router';

export const ONBOARDING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./onboarding-list/onboarding-list.component').then(c => c.OnboardingListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./onboarding-detail/onboarding-detail.component').then(c => c.OnboardingDetailComponent)
  }
];