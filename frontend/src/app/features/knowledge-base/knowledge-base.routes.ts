import { Routes } from '@angular/router';

export const KNOWLEDGE_BASE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./article-list/article-list.component').then(c => c.ArticleListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./article-detail/article-detail.component').then(c => c.ArticleDetailComponent)
  }
];