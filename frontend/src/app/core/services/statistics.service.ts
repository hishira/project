import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserStatistics, ChartData } from '../../shared/models/statistics.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private readonly API_URL = environment.apiUrl || 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getUserStatistics(): Observable<UserStatistics> {
    return this.http.get<UserStatistics>(`${this.API_URL}/user-statistics`)
      .pipe(catchError(this.handleError));
  }

  recalculateStatistics(): Observable<UserStatistics> {
    return this.http.post<UserStatistics>(`${this.API_URL}/user-statistics/recalculate`, {})
      .pipe(catchError(this.handleError));
  }

  getStatistics(params?: any): Observable<any> {
    return this.getUserStatistics();
  }

  getActivityTypeChartData(stats: any): ChartData {
    return {
      labels: ['Running', 'Swimming', 'Cycling', 'Walking', 'Strength Training', 'Other'],
      datasets: [{
        label: 'Activity Count',
        data: [
          stats.totalRunning || 0,
          stats.totalSwimming || 0,
          stats.totalCycling || 0,
          stats.totalWalking || 0,
          stats.totalStrengthTraining || 0,
          stats.totalOther || 0
        ],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        borderWidth: 2
      }]
    };
  }

  getIntensityLevelChartData(stats: any): ChartData {
    return {
      labels: ['Low', 'Moderate', 'High', 'Very High'],
      datasets: [{
        label: 'Activity Count',
        data: [
          stats.totalLowIntensity || 0,
          stats.totalModerateIntensity || 0,
          stats.totalHighIntensity || 0,
          stats.totalVeryHighIntensity || 0
        ],
        backgroundColor: [
          '#4CAF50',
          '#FFC107',
          '#FF9800',
          '#F44336'
        ],
        borderWidth: 2
      }]
    };
  }

  getDurationTrendChartData(stats: any): ChartData {
    // Mock data for trend - in real app this would come from API
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }

    return {
      labels: last7Days,
      datasets: [{
        label: 'Duration (minutes)',
        data: [45, 60, 30, 75, 90, 40, 65], // Mock data
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };
  }

  // Helper methods for chart data preparation
  prepareDistanceChartData(statistics: UserStatistics) {
    return {
      labels: ['Running', 'Swimming', 'Cycling', 'Skating', 'Walking', 'Hiking'],
      datasets: [{
        label: 'Distance (km)',
        data: [
          statistics.totalRunningDistance,
          statistics.totalSwimmingDistance,
          statistics.totalCyclingDistance,
          statistics.totalSkatingDistance,
          statistics.totalWalkingDistance,
          statistics.totalHikingDistance
        ],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        borderWidth: 2
      }]
    };
  }

  prepareActivityCountChartData(statistics: UserStatistics) {
    return {
      labels: [
        'Running', 'Swimming', 'Cycling', 'Skating', 'Walking', 'Hiking',
        'Gym', 'Yoga', 'Tennis', 'Football', 'Basketball', 'Horse Riding', 'Other'
      ],
      datasets: [{
        label: 'Activity Count',
        data: [
          statistics.totalRunningActivities,
          statistics.totalSwimmingActivities,
          statistics.totalCyclingActivities,
          statistics.totalSkatingActivities,
          statistics.totalWalkingActivities,
          statistics.totalHikingActivities,
          statistics.totalGymWorkoutActivities,
          statistics.totalYogaActivities,
          statistics.totalTennisActivities,
          statistics.totalFootballActivities,
          statistics.totalBasketballActivities,
          statistics.totalHorseRidingActivities,
          statistics.totalOtherActivities
        ],
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'
        ],
        borderWidth: 2
      }]
    };
  }

  prepareOverviewData(statistics: UserStatistics) {
    return {
      totalActivities: statistics.totalActivities,
      totalDuration: this.formatDuration(statistics.totalDuration),
      totalCalories: Math.round(statistics.totalCaloriesBurned),
      totalDistance: Math.round(statistics.totalDistanceAllActivities * 100) / 100,
      averageDifficulty: Math.round(statistics.averageDifficulty * 10) / 10,
      averageDuration: this.formatDuration(statistics.averageDuration),
      currentStreak: statistics.currentStreak,
      longestStreak: statistics.longestStreak,
      lastActivityDate: statistics.lastActivityDate
    };
  }

  prepareBestRecordsData(statistics: UserStatistics) {
    const records: any[] = [];

    // Distance records
    if (statistics.distanceRecords) {
      const distanceRecords = statistics.distanceRecords;
      Object.entries(distanceRecords).forEach(([key, record]) => {
        if (record) {
          records.push({
            category: 'Distance',
            type: this.formatRecordType(key),
            value: `${record.value} ${record.unit}`,
            achievedAt: record.achievedAt,
            activityTitle: record.activityTitle
          });
        }
      });
    }

    // Speed records
    if (statistics.speedRecords) {
      const speedRecords = statistics.speedRecords;
      Object.entries(speedRecords).forEach(([key, record]) => {
        if (record) {
          records.push({
            category: 'Speed',
            type: this.formatRecordType(key),
            value: `${record.value} ${record.unit}`,
            achievedAt: record.achievedAt,
            activityTitle: record.activityTitle
          });
        }
      });
    }

    // General records
    if (statistics.generalRecords) {
      const generalRecords = statistics.generalRecords;
      Object.entries(generalRecords).forEach(([key, record]) => {
        if (record) {
          records.push({
            category: 'General',
            type: this.formatRecordType(key),
            value: `${record.value} ${record.unit}`,
            achievedAt: record.achievedAt,
            activityTitle: record.activityTitle
          });
        }
      });
    }

    return records;
  }

  private formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  private formatRecordType(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private handleError = (error: any): Observable<never> => {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(errorMessage);
  };
}
