import { Routes } from '@angular/router';

export const DOCUMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./document-list/document-list.component').then(c => c.DocumentListComponent)
  },
  //   {
  //     path: 'new',
  //     loadComponent: () => import('./document-upload/document-upload.component').then(c => c.DocumentUploadComponent) // do zrobienia
  //   },
  {
    path: ':id',
    loadComponent: () => import('./document-detail/document-detail.component').then(c => c.DocumentDetailComponent)
  }
];