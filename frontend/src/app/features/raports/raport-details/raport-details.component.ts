import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { SAMPLE_REPORT_DETAILS } from './samples';
import { Report } from '../types';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { RaportTypesComponent } from './raport-types/raport-types.component';

@Component({
  selector: 'app-report-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    BaseChartDirective,
    PageHeaderComponent,
    MainPageViewComponent,
    RaportTypesComponent,
  ],
  templateUrl: './raport-details.component.html',
  styleUrls: ['./report-details.components.scss']
})
export class ReportDetailComponent implements OnInit {
  report?: Report = SAMPLE_REPORT_DETAILS[0];

  // Dla wykresu
  chartData?: ChartData;
  chartLabels?: string[];
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };
  chartType: ChartType = 'bar';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.report = SAMPLE_REPORT_DETAILS.find(r => r.id === id);
    } else {
      // Domyślnie pierwszy
      this.report = SAMPLE_REPORT_DETAILS[0];
    }

    if (this.report?.type === 'dashboard') {
      this.prepareChartData(this.report.data);
    }
  }

  private prepareChartData(data: any): void {
    if (data && data.labels && data.datasets) {
      this.chartLabels = data.labels;
      this.chartData = {
        labels: data.labels,
        datasets: data.datasets
      };
    }
  }

  // Pomocnicze metody do szablonu
  isTableData(data: any): boolean {
    return Array.isArray(data) && data.length > 0 && typeof data[0] === 'object';
  }

  getTableColumns(data: any[]): string[] {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }

  isSummaryObject(data: any): boolean {
    return data && typeof data === 'object' && !Array.isArray(data);
  }

  downloadReport(): void {
    console.log('Pobieranie raportu:', this.report);
    // Tutaj można dodać logikę generowania pliku
    alert('Symulacja pobierania raportu: ' + this.report?.name);
  }
}