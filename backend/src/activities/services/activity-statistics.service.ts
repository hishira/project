import { Injectable } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import {
  Activity,
  ActivityType,
  DifficultyLevel,
} from '../../entities/activity.entity';

export interface ActivityStatistics {
  totalActivities: number;
  totalDuration: number;
  averageDifficulty: number;
  activitiesByType: Record<ActivityType, number>;
  activitiesByDifficulty: Record<DifficultyLevel, number>;
  totalCaloriesBurned: number;
}

@Injectable()
export class ActivityStatisticsService {
  /**
   * Calculate comprehensive statistics from activities
   */
  calculateStatistics(activities: Activity[]): ActivityStatistics {
    const totalActivities = activities.length;

    if (totalActivities === 0) {
      // Create initial empty records with all possible values set to 0
      const emptyTypeStats = Object.values(ActivityType).reduce(
        (acc, type) => ({ ...acc, [type]: 0 }),
        {} as Record<ActivityType, number>,
      );

      const emptyDifficultyStats = [1, 2, 3, 4, 5].reduce(
        (acc, difficulty) => ({ ...acc, [difficulty]: 0 }),
        {} as Record<DifficultyLevel, number>,
      );

      return {
        totalActivities: 0,
        totalDuration: 0,
        averageDifficulty: 0,
        activitiesByType: emptyTypeStats,
        activitiesByDifficulty: emptyDifficultyStats,
        totalCaloriesBurned: 0,
      };
    }

    const totalDuration = activities.reduce(
      (sum, activity) => sum + activity.duration,
      0,
    );

    const averageDifficulty =
      activities.reduce((sum, activity) => sum + activity.difficulty, 0) /
      totalActivities;

    const activitiesByType = activities.reduce(
      (acc, activity) => {
        acc[activity.type] = (acc[activity.type] || 0) + 1;
        return acc;
      },
      {} as Record<ActivityType, number>,
    );

    const activitiesByDifficulty = activities.reduce(
      (acc, activity) => {
        acc[activity.difficulty] = (acc[activity.difficulty] || 0) + 1;
        return acc;
      },
      {} as Record<DifficultyLevel, number>,
    );

    const totalCaloriesBurned = activities.reduce(
      (sum, activity) => sum + (activity.caloriesBurned || 0),
      0,
    );

    return {
      totalActivities,
      totalDuration,
      averageDifficulty: Math.round(averageDifficulty * 10) / 10,
      activitiesByType,
      activitiesByDifficulty,
      totalCaloriesBurned,
    };
  }

  /**
   * Get activity statistics for a user with date filtering
   */
  async getStatistics(
    repository: Repository<Activity>,
    userLogin: string,
    options?: {
      dateFrom?: string;
      dateTo?: string;
    },
  ): Promise<ActivityStatistics> {
    const whereCondition: { userLogin: string; activityDate?: any } = {
      userLogin,
    };

    if (options?.dateFrom || options?.dateTo) {
      if (options.dateFrom && options.dateTo) {
        whereCondition.activityDate = Between(
          new Date(options.dateFrom),
          new Date(options.dateTo),
        );
      } else if (options.dateFrom) {
        whereCondition.activityDate = { gte: new Date(options.dateFrom) };
      } else if (options.dateTo) {
        whereCondition.activityDate = { lte: new Date(options.dateTo) };
      }
    }

    const activities = await repository.find({
      where: whereCondition,
    });

    return this.calculateStatistics(activities);
  }
}
