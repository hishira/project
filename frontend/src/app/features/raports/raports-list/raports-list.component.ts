// report-list.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { CommonRouterService } from '../../../core/services/common-router.service';
import { Report, ReportType } from '../types';
import { ReportService } from './raport.service';

@Component({
  selector: 'app-report-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatTooltipModule,
    PageHeaderComponent,
    MainPageViewComponent,
  ],
  providers: [CommonRouterService],
  templateUrl: './raports-list.component.html',
  styleUrl: './raport-list.component.scss',
})
export class ReportListComponent {
  readonly reportService = inject(ReportService);
  readonly routerService = inject(CommonRouterService)
  getIconForType(type: ReportType): string {
    const icons: Record<ReportType, string> = {
      dashboard: 'dashboard',
      tabular: 'table_rows',
      summary: 'summarize',
      detailed: 'list_alt',
      custom: 'extension'
    };
    return icons[type] || 'description';
  }

  previewReport(report: Report): void {
    // placeholder – otwarcie podglądu
    this.routerService.navitgateTo(['../details/rpt-001']);
  }

  downloadReport(report: Report): void {
    // placeholder – pobieranie pliku
    console.log('Download:', report);
  }

  getAvatarLetter(type: ReportType): string {
    const map: Record<ReportType, string> = {
      dashboard: 'D',
      tabular: 'T',
      summary: 'S',
      detailed: 'Sz',
      custom: 'C'
    };
    return map[type] || 'R';
  }

  getAvatarColor(type: ReportType): string {
    const colors: Record<ReportType, string> = {
      dashboard: '#bbdefb',
      tabular: '#fff9c4',
      summary: '#c8e6c9',
      detailed: '#d1c4e9',
      custom: '#ffccbc'
    };
    return colors[type] || '#e0e0e0';
  }

  formatSourceSystem(system: string): string {
    const map: Record<string, string> = {
      'crm': 'CRM',
      'product-management': 'Product',
      'other': 'Inne'
    };
    return map[system] || system;
  }

  isExpiringSoon(expiresAt: Date): boolean {
    const now = new Date();
    const diffDays = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }
}