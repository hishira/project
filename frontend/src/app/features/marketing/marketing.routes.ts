import { Routes } from '@angular/router';

export const MARKETING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./marketing-dashboard/marketing-dashboard.component').then(c => c.MarketingDashboardComponent)
  },
  {
    path: 'campaigns',
    loadComponent: () => import('./campaign-list/campaign-list.component').then(c => c.CampaignListComponent)
  },
  {
    path: 'campaigns/:id',
    loadComponent: () => import('./campaign-detail/campaign-detail.component').then(c => c.CampaignDetailComponent)
  },
  {
    path: 'segments',
    loadComponent: () => import('./segment-list/segment-list.component').then(c => c.SegmentListComponent)
  },
  {
    path: 'templates',
    loadComponent: () => import('./template-list/template-list.component').then(c => c.TemplateListComponent)
  }
];