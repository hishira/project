import { Routes } from '@angular/router';

export const INVOICES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./invoice-list/invoice-list.component').then(c => c.InvoiceListComponent)
  },
  {
    path: 'report',
    loadComponent: () => import('./receivables-report.component').then(c => c.ReceivablesReportComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./invoice-detail/invoice-detail.component').then(c => c.InvoiceDetailComponent)
  }
];