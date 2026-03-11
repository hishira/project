import { Routes } from '@angular/router';

export const SOCIAL_ROUTES: Routes = [
  { path: '', redirectTo: 'mentions', pathMatch: 'full' },
  {
    path: 'mentions',
    loadComponent: () => import('./mention-list/mention-list.component').then(c => c.MentionListComponent)
  },
  {
    path: 'mentions/:id',
    loadComponent: () => import('./mention-detail/mention-detail.component').then(c => c.MentionDetailComponent)
  },
  {
    path: 'publish',
    loadComponent: () => import('./post-scheduler/post-scheduler.component').then(c => c.PostSchedulerComponent)
  },
  {
    path: 'profiles',
    loadComponent: () => import('./profile-list/profile-list.component').then(c => c.ProfileListComponent)
  }
];