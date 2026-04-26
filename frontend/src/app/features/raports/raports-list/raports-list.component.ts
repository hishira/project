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
import {
  formatSourceSystem,
  getAvatarColor,
  getAvatarLetter,
  getIconForType,
  isExpiringSoon
} from '../raports.utils';

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
  readonly routerService = inject(CommonRouterService);

  // Expose utility functions for template
  readonly getIconForType = getIconForType;
  readonly getAvatarLetter = getAvatarLetter;
  readonly getAvatarColor = getAvatarColor;
  readonly formatSourceSystem = formatSourceSystem;
  readonly isExpiringSoon = isExpiringSoon;

  previewReport(report: Report): void {
    // placeholder – otwarcie podglądu
    this.routerService.navitgateTo(['../details/rpt-001']);
  }

  downloadReport(report: Report): void {
    // placeholder – pobieranie pliku
    console.log('Download:', report);
  }
}