// report-detail.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Report } from '../../types';
import { RaportChartData } from './rarport-chart-data/rarport-chart-data.component';
import { getTableColumns, isSummaryObject, isTableData } from '../../raports.utils';

@Component({
  selector: 'app-report-types',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    RaportChartData
  ],
  templateUrl: './raport-types.component.html',
  styleUrls: ['./raport-types.component.scss']
})
export class RaportTypesComponent {
  // Sygnał przechowujący aktualny raport
  readonly report = input.required<Report>();

  // Expose utility functions for template
  readonly isTableData = isTableData;
  readonly getTableColumns = getTableColumns;
  readonly isSummaryObject = isSummaryObject;

  /**
   * Symulacja pobierania raportu.
   */
  downloadReport(): void {
    const currentReport = this.report();
    if (currentReport) {
      console.log('Pobieranie raportu:', currentReport);
      alert(`Symulacja pobierania raportu: ${currentReport.name}`);
    }
  }
}