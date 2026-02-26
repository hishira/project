// report-detail.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Report } from '../../types';
import { RaportChartData } from './rarport-chart-data/rarport-chart-data.component';
@Component({
  selector: 'app-report-types',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
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
  report = input.required<Report>();

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