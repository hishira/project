import { Injectable, inject } from '@angular/core';
import { UserStatistics } from '../../shared/models/statistics.model';
import { DataFormatterService } from './data-formatter.service';

export interface OverviewData {
  totalActivities: number;
  totalDuration: string;
  totalCalories: number;
  totalDistance: number;
  averageDifficulty: number;
  averageDuration: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;
}

export interface RecordData {
  category: string;
  type: string;
  value: string;
  achievedAt: string;
  activityTitle: string;
}

@Injectable({
  providedIn: 'root'
})
export class OverviewDataService {
  private readonly dataFormatter = inject(DataFormatterService);

  /**
   * Prepare overview data from user statistics
   */
  prepareOverviewData(statistics: UserStatistics): OverviewData {
    return {
      totalActivities: statistics.totalActivities,
      totalDuration: this.dataFormatter.formatDuration(statistics.totalDuration),
      totalCalories: Math.round(statistics.totalCaloriesBurned),
      totalDistance: this.dataFormatter.roundToDecimal(statistics.totalDistanceAllActivities, 2),
      averageDifficulty: this.dataFormatter.roundToDecimal(statistics.averageDifficulty),
      averageDuration: this.dataFormatter.formatDuration(statistics.averageDuration),
      currentStreak: statistics.currentStreak,
      longestStreak: statistics.longestStreak,
      lastActivityDate: statistics.lastActivityDate ? new Date(statistics.lastActivityDate).toISOString().split('T')[0] : undefined
    };
  }

  /**
   * Prepare best records data from user statistics
   */
  prepareBestRecordsData(statistics: UserStatistics): RecordData[] {
    const records: RecordData[] = [];

    // Process distance records
    if (statistics.distanceRecords) {
      this.addRecordsFromCategory(records, 'Distance', statistics.distanceRecords);
    }

    // Process speed records
    if (statistics.speedRecords) {
      this.addRecordsFromCategory(records, 'Speed', statistics.speedRecords);
    }

    // Process general records
    if (statistics.generalRecords) {
      this.addRecordsFromCategory(records, 'General', statistics.generalRecords);
    }

    return records.sort((a, b) => 
      new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime()
    );
  }

  /**
   * Calculate activity summary statistics
   */
  calculateActivitySummary(statistics: UserStatistics) {
    const totalDistanceActivities = [
      statistics.totalRunningDistance,
      statistics.totalSwimmingDistance,
      statistics.totalCyclingDistance,
      statistics.totalSkatingDistance,
      statistics.totalWalkingDistance,
      statistics.totalHikingDistance
    ].reduce((sum, distance) => sum + (distance || 0), 0);

    const totalCountActivities = [
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
    ].reduce((sum, count) => sum + (count || 0), 0);

    return {
      totalDistanceActivities,
      totalCountActivities,
      averageCaloriesPerActivity: totalCountActivities > 0 
        ? Math.round(statistics.totalCaloriesBurned / totalCountActivities)
        : 0,
      averageDistancePerActivity: totalCountActivities > 0
        ? this.dataFormatter.roundToDecimal(totalDistanceActivities / totalCountActivities, 2)
        : 0
    };
  }

  /**
   * Get activity type breakdown
   */
  getActivityTypeBreakdown(statistics: UserStatistics) {
    const activities = [
      { type: 'Running', count: statistics.totalRunningActivities, distance: statistics.totalRunningDistance },
      { type: 'Swimming', count: statistics.totalSwimmingActivities, distance: statistics.totalSwimmingDistance },
      { type: 'Cycling', count: statistics.totalCyclingActivities, distance: statistics.totalCyclingDistance },
      { type: 'Walking', count: statistics.totalWalkingActivities, distance: statistics.totalWalkingDistance },
      { type: 'Hiking', count: statistics.totalHikingActivities, distance: statistics.totalHikingDistance },
      { type: 'Gym Workout', count: statistics.totalGymWorkoutActivities, distance: 0 },
      { type: 'Yoga', count: statistics.totalYogaActivities, distance: 0 },
      { type: 'Tennis', count: statistics.totalTennisActivities, distance: 0 },
      { type: 'Football', count: statistics.totalFootballActivities, distance: 0 },
      { type: 'Basketball', count: statistics.totalBasketballActivities, distance: 0 },
      { type: 'Skating', count: statistics.totalSkatingActivities, distance: statistics.totalSkatingDistance },
      { type: 'Horse Riding', count: statistics.totalHorseRidingActivities, distance: 0 },
      { type: 'Other', count: statistics.totalOtherActivities, distance: 0 }
    ].filter(activity => activity.count > 0)
     .sort((a, b) => b.count - a.count);

    return activities;
  }

  /**
   * Private helper methods
   */
  private addRecordsFromCategory(
    records: RecordData[], 
    category: string, 
    recordsData: any
  ): void {
    Object.entries(recordsData).forEach(([key, record]) => {
      if (record && typeof record === 'object' && 'value' in record) {
        const recordObj = record as any; // Type assertion for flexible record structure
        records.push({
          category,
          type: this.dataFormatter.formatRecordType(key),
          value: `${recordObj.value} ${recordObj.unit ?? ''}`,
          achievedAt: recordObj.achievedAt ?? '',
          activityTitle: recordObj.activityTitle ?? ''
        });
      }
    });
  }
}
