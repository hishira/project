import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../analytics.service';

@Component({
  selector: 'app-chart-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-placeholder">
      <p>Wykres: {{ report?.name }}</p>
      <pre>{{ chartData | json }}</pre>
      <button mat-stroked-button (click)="refresh()">Odśwież dane</button>
    </div>
  `,
  styles: [`
    .chart-placeholder {
      background: #f1f5f9;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  `]
})
export class ChartWidgetComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);
  @Input() config!: any;

  report: any;
  chartData: any;

  ngOnInit(): void {
    if (this.config.reportId) {
      this.report = this.analyticsService.reports().find(r => r.id === this.config.reportId);
      this.refresh();
    }
  }

  refresh() {
    if (this.config.reportId) {
      const result = this.analyticsService.getReportData(this.config.reportId);
      this.chartData = result.data;
    }
  }
}