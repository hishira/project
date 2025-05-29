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

  constructor(private readonly http: HttpClient) {}

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
    const activities = [
      { label: 'Running', count: stats.totalRunningActivities ?? 0, color: '#FF6384' },
      { label: 'Swimming', count: stats.totalSwimmingActivities ?? 0, color: '#36A2EB' },
      { label: 'Cycling', count: stats.totalCyclingActivities ?? 0, color: '#FFCE56' },
      { label: 'Walking', count: stats.totalWalkingActivities ?? 0, color: '#4BC0C0' },
      { label: 'Hiking', count: stats.totalHikingActivities ?? 0, color: '#9966FF' },
      { label: 'Gym Workout', count: stats.totalGymWorkoutActivities ?? 0, color: '#FF9F40' },
      { label: 'Yoga', count: stats.totalYogaActivities ?? 0, color: '#FF6B6B' },
      { label: 'Tennis', count: stats.totalTennisActivities ?? 0, color: '#4ECDC4' },
      { label: 'Football', count: stats.totalFootballActivities ?? 0, color: '#45B7D1' },
      { label: 'Basketball', count: stats.totalBasketballActivities ?? 0, color: '#96CEB4' },
      { label: 'Skating', count: stats.totalSkatingActivities ?? 0, color: '#FFEAA7' },
      { label: 'Horse Riding', count: stats.totalHorseRidingActivities ?? 0, color: '#DDA0DD' },
      { label: 'Other', count: stats.totalOtherActivities ?? 0, color: '#C9CBCF' }
    ].filter(activity => activity.count > 0);

    return {
      labels: activities.map(a => a.label),
      datasets: [{
        label: 'Activity Count',
        data: activities.map(a => a.count),
        backgroundColor: activities.map(a => a.color),
        borderWidth: 2
      }]
    };
  }

  getIntensityLevelChartData(activities: any[]): ChartData {
    const intensityLevels = {
      'Easy (1-2)': 0,
      'Moderate (3)': 0,
      'Hard (4)': 0,
      'Very Hard (5)': 0
    };

    if (activities && Array.isArray(activities)) {
      activities.forEach(activity => {
        const difficulty = parseInt(activity.difficulty);
        if (difficulty >= 1 && difficulty <= 2) {
          intensityLevels['Easy (1-2)']++;
        } else if (difficulty === 3) {
          intensityLevels['Moderate (3)']++;
        } else if (difficulty === 4) {
          intensityLevels['Hard (4)']++;
        } else if (difficulty === 5) {
          intensityLevels['Very Hard (5)']++;
        }
      });
    }

    const nonZeroLevels = Object.entries(intensityLevels).filter(([_, count]) => count > 0);

    return {
      labels: nonZeroLevels.map(([level, _]) => level),
      datasets: [{
        label: 'Activity Count',
        data: nonZeroLevels.map(([_, count]) => count),
        backgroundColor: [
          '#4CAF50', // Easy - Green
          '#FFC107', // Moderate - Yellow  
          '#FF9800', // Hard - Orange
          '#F44336'  // Very Hard - Red
        ].slice(0, nonZeroLevels.length),
        borderWidth: 2
      }]
    };
  }

  getDurationTrendChartData(activities: any[]): ChartData {
    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Duration (minutes)',
          data: [],
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          fill: true,
          tension: 0.4
        }]
      };
    }

    // Group activities by date and sum durations
    const dailyDurations = new Map<string, number>();
    
    activities.forEach(activity => {
      const date = new Date(activity.activityDate).toISOString().split('T')[0];
      const current = dailyDurations.get(date) ?? 0;
      dailyDurations.set(date, current + activity.duration);
    });

    // Sort by date and get last 7 days of data
    const sortedEntries = Array.from(dailyDurations.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7);

    const labels = sortedEntries.map(([date]) => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    });

    const data = sortedEntries.map(([_, duration]) => duration);

    return {
      labels,
      datasets: [{
        label: 'Duration (minutes)',
        data,
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
