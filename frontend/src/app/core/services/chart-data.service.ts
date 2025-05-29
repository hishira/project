import { Injectable, inject } from '@angular/core';
import { ChartData } from '../../shared/models/statistics.model';
import { UserStatistics } from '../../shared/models/statistics.model';
import { Activity } from '../../shared/models/activity.model';
import { DataFormatterService } from './data-formatter.service';

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  private readonly dataFormatter = inject(DataFormatterService);

  /**
   * Chart color palettes
   */
  private readonly colors = {
    primary: [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#C9CBCF'
    ],
    intensity: {
      easy: '#4CAF50',      // Green
      moderate: '#FFC107',  // Yellow
      hard: '#FF9800',      // Orange
      veryHard: '#F44336'   // Red
    },
    trend: {
      primary: '#2196F3',
      background: 'rgba(33, 150, 243, 0.1)'
    }
  };

  /**
   * Generate activity type chart data
   */
  getActivityTypeChartData(stats: UserStatistics): ChartData {
    const activities = [
      { label: 'Running', count: stats.totalRunningActivities ?? 0 },
      { label: 'Swimming', count: stats.totalSwimmingActivities ?? 0 },
      { label: 'Cycling', count: stats.totalCyclingActivities ?? 0 },
      { label: 'Walking', count: stats.totalWalkingActivities ?? 0 },
      { label: 'Hiking', count: stats.totalHikingActivities ?? 0 },
      { label: 'Gym Workout', count: stats.totalGymWorkoutActivities ?? 0 },
      { label: 'Yoga', count: stats.totalYogaActivities ?? 0 },
      { label: 'Tennis', count: stats.totalTennisActivities ?? 0 },
      { label: 'Football', count: stats.totalFootballActivities ?? 0 },
      { label: 'Basketball', count: stats.totalBasketballActivities ?? 0 },
      { label: 'Skating', count: stats.totalSkatingActivities ?? 0 },
      { label: 'Horse Riding', count: stats.totalHorseRidingActivities ?? 0 },
      { label: 'Other', count: stats.totalOtherActivities ?? 0 }
    ].filter(activity => activity.count > 0);

    return {
      labels: activities.map(a => a.label),
      datasets: [{
        label: 'Activity Count',
        data: activities.map(a => a.count),
        backgroundColor: this.colors.primary.slice(0, activities.length),
        borderWidth: 2
      }]
    };
  }

  /**
   * Generate intensity level chart data from activities
   */
  getIntensityLevelChartData(activities: Activity[]): ChartData {
    const intensityLevels = {
      'Easy (1-2)': 0,
      'Moderate (3)': 0,
      'Hard (4)': 0,
      'Very Hard (5)': 0
    };

    if (activities && Array.isArray(activities)) {
      activities.forEach(activity => {
        const difficulty = parseInt(String(activity.difficulty));
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
          this.colors.intensity.easy,
          this.colors.intensity.moderate,
          this.colors.intensity.hard,
          this.colors.intensity.veryHard
        ].slice(0, nonZeroLevels.length),
        borderWidth: 2
      }]
    };
  }

  /**
   * Generate duration trend chart data
   */
  getDurationTrendChartData(activities: Activity[]): ChartData {
    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return this.getEmptyTrendChart();
    }

    const dailyDurations = this.aggregateActivitiesByDate(activities);
    const sortedEntries = this.getSortedRecentEntries(dailyDurations, 7);
    
    const labels = sortedEntries.map(([date]) => 
      new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
    );
    
    const data = sortedEntries.map(([_, duration]) => duration);

    return {
      labels,
      datasets: [{
        label: 'Duration (minutes)',
        data,
        borderColor: this.colors.trend.primary,
        backgroundColor: this.colors.trend.background,
        fill: true,
        tension: 0.4
      }]
    };
  }

  /**
   * Generate distance chart data
   */
  getDistanceChartData(statistics: UserStatistics): ChartData {
    const distanceActivities = [
      { label: 'Running', distance: statistics.totalRunningDistance },
      { label: 'Swimming', distance: statistics.totalSwimmingDistance },
      { label: 'Cycling', distance: statistics.totalCyclingDistance },
      { label: 'Skating', distance: statistics.totalSkatingDistance },
      { label: 'Walking', distance: statistics.totalWalkingDistance },
      { label: 'Hiking', distance: statistics.totalHikingDistance }
    ].filter(activity => activity.distance > 0);

    return {
      labels: distanceActivities.map(a => a.label),
      datasets: [{
        label: 'Distance (km)',
        data: distanceActivities.map(a => a.distance),
        backgroundColor: this.colors.primary.slice(0, distanceActivities.length),
        borderWidth: 2
      }]
    };
  }

  /**
   * Generate goal progress chart data
   */
  getGoalProgressChartData(progress: number, isWeekly: boolean = false): ChartData {
    const remaining = Math.max(0, 100 - progress);
    const color = isWeekly ? '#4caf50' : '#2196f3';

    return {
      labels: ['Completed', 'Remaining'],
      datasets: [{
        data: [progress, remaining],
        backgroundColor: [color, '#e0e0e0'],
        borderWidth: 0
      }]
    };
  }

  /**
   * Private helper methods
   */
  private getEmptyTrendChart(): ChartData {
    return {
      labels: [],
      datasets: [{
        label: 'Duration (minutes)',
        data: [],
        borderColor: this.colors.trend.primary,
        backgroundColor: this.colors.trend.background,
        fill: true,
        tension: 0.4
      }]
    };
  }

  private aggregateActivitiesByDate(activities: Activity[]): Map<string, number> {
    const dailyDurations = new Map<string, number>();
    
    activities.forEach(activity => {
      const date = new Date(activity.activityDate).toISOString().split('T')[0];
      const current = dailyDurations.get(date) ?? 0;
      dailyDurations.set(date, current + activity.duration);
    });

    return dailyDurations;
  }

  private getSortedRecentEntries(dataMap: Map<string, number>, days: number): [string, number][] {
    return Array.from(dataMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-days);
  }
}
