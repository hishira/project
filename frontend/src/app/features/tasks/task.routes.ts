import { Routes } from '@angular/router';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./task-list/task-list.component').then(c => c.TaskListComponent)
  },
  {
    path: 'calendar',
    loadComponent: () => import('./task-calendar/task-calendar.component').then(c => c.TaskCalendarComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./task-detail/task-detail.component').then(c => c.TaskDetailComponent)
  }
];