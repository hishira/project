import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AdminStatistics, ChartData } from '../../shared/models/statistics.model';
import { environment } from '../../../environments/environment';
import { ChartDataService } from './chart-data.service';
import { OverviewDataService, OverviewData, RecordData } from './overview-data.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private readonly API_URL = environment.apiUrl || 'http://localhost:3000';
  private readonly chartDataService = inject(ChartDataService);
  private readonly overviewDataService = inject(OverviewDataService);

  constructor(private readonly http: HttpClient) {}

  getUserStatistics(): Observable<AdminStatistics> {
    return this.http.get<AdminStatistics>(`${this.API_URL}/user-statistics`)
      .pipe(catchError(this.handleError));
  }

  recalculateStatistics(): Observable<AdminStatistics> {
    return this.http.post<AdminStatistics>(`${this.API_URL}/user-statistics/recalculate`, {})
      .pipe(catchError(this.handleError));
  }

  getStatistics(params?: any): Observable<any> {
    return this.getUserStatistics();
  }

  // Chart data methods - delegate to ChartDataService
  getActivityTypeChartData(stats: AdminStatistics): ChartData {
    return this.chartDataService.getActivityTypeChartData(stats);
  }

  getIntensityLevelChartData(activities: any[]): ChartData {
    return this.chartDataService.getIntensityLevelChartData(activities);
  }

  getDurationTrendChartData(activities: any[]): ChartData {
    return this.chartDataService.getDurationTrendChartData(activities);
  }

  prepareDistanceChartData(statistics: AdminStatistics): ChartData {
    return this.chartDataService.getDistanceChartData(statistics);
  }

  prepareActivityCountChartData(statistics: AdminStatistics): ChartData {
    return this.chartDataService.getActivityTypeChartData(statistics);
  }

  // Overview data methods - delegate to OverviewDataService
  prepareOverviewData(statistics: AdminStatistics): OverviewData {
    return this.overviewDataService.prepareOverviewData(statistics);
  }

  prepareBestRecordsData(statistics: AdminStatistics): RecordData[] {
    return this.overviewDataService.prepareBestRecordsData(statistics);
  }

  private readonly handleError = (error: any): Observable<never> => {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  };
}
