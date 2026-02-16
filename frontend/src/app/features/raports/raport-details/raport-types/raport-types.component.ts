// report-detail.component.ts
import { Component, inject, OnInit, signal, effect, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Report } from '../../types';

@Component({
  selector: 'app-report-types',
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
    BaseChartDirective
  ],
  templateUrl: './raport-types.component.html',
  styleUrls: ['./raport-types.component.scss']
})
export class RaportTypesComponent  {
  
  // Sygnał przechowujący aktualny raport
  report = input.required<Report>();

  // Sygnały dla danych wykresu (używane tylko gdy report.type === 'dashboard')
  chartData = signal<ChartData>({} as ChartData);
  chartLabels = signal<string[] >([]);
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };
  chartType: ChartType = 'bar';

  constructor() {
    // Automatyczna aktualizacja wykresu przy zmianie raportu
    effect(() => {
      const currentReport = this.report();
      if (currentReport?.type === 'dashboard') {
        this.prepareChartData(currentReport.data);
      } else {
        // Czyścimy dane wykresu, jeśli raport nie jest dashboardem
        this.chartData.set({} as ChartData);
        this.chartLabels.set([]);
      }
    });
  }

 

  /**
   * Przygotowuje dane do wykresu na podstawie surowego obiektu data.
   */
  private prepareChartData(data: any): void {
    if (data?.labels && Array.isArray(data.datasets)) {
      this.chartLabels.set(data.labels);
      this.chartData.set({
        labels: data.labels,
        datasets: data.datasets
      });
    } else {
      this.chartData.set({} as ChartData);
      this.chartLabels.set([]);
    }
  }

  /**
   * Sprawdza, czy dane nadają się do wyświetlenia w tabeli.
   * (zgodność z logiką w szablonie)
   */
  isTableData(data: any): boolean {
    return Array.isArray(data) && data.length > 0 && typeof data[0] === 'object';
  }

  /**
   * Zwraca nazwy kolumn dla danych tabelarycznych.
   * UWAGA: Metoda wywoływana wielokrotnie w szablonie – w celach optymalizacyjnych
   * warto rozważyć obliczenie kolumn raz (patrz sugestie poniżej).
   */
  getTableColumns(data: any[]): string[] {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }

  /**
   * Sprawdza, czy dane są obiektem (nie tablicą) – dla widoku podsumowania.
   */
  isSummaryObject(data: any): boolean {
    return data && typeof data === 'object' && !Array.isArray(data);
  }

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