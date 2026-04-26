// report.service.ts
import { Injectable, signal } from '@angular/core';
import { SAMPLE_REPORTS } from '../raports-mock-data';
import { Report } from '../types';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private reportsSignal = signal<Report[]>(SAMPLE_REPORTS);

  readonly reports = this.reportsSignal.asReadonly();

  // Metoda do ewentualnego dodawania/usuwania w przyszłości
  refreshReports(): void {
    // np. pobieranie z API
    this.reportsSignal.set(SAMPLE_REPORTS);
  }
}