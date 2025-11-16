import { Routes } from '@angular/router';

export const userListRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user-list.component').then((c) => c.UserListComponent),
    
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./../user-details/user-details.component').then(
        (c) => c.UserDetailsComponent
      ),
  }
];
