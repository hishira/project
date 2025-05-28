import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStatistics, BestRecord } from '../entities/user-statistics.entity';
import {
  Activity,
  ActivityType,
  SwimmingMetadata,
  RunningMetadata,
  CyclingMetadata,
  DifficultyLevel,
} from '../entities/activity.entity';

@Injectable()
export class UserStatisticsService {
  constructor(
    @InjectRepository(UserStatistics)
    private userStatisticsRepository: Repository<UserStatistics>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async getUserStatistics(userLogin: string): Promise<UserStatistics> {
    const statistics = await this.userStatisticsRepository.findOne({
      where: { userLogin },
    });

    if (!statistics) {
      return this.getOrCreateStatistics(userLogin);
    }

    return statistics;
  }

  async getOrCreateStatistics(userLogin: string): Promise<UserStatistics> {
    let statistics = await this.userStatisticsRepository.findOne({
      where: { userLogin },
    });

    if (!statistics) {
      statistics = this.userStatisticsRepository.create({
        userLogin,
        totalRunningDistance: 0,
        totalSwimmingDistance: 0,
        totalCyclingDistance: 0,
        totalSkatingDistance: 0,
        totalWalkingDistance: 0,
        totalHikingDistance: 0,
        totalRunningActivities: 0,
        totalSwimmingActivities: 0,
        totalCyclingActivities: 0,
        totalSkatingActivities: 0,
        totalWalkingActivities: 0,
        totalHikingActivities: 0,
        totalGymWorkoutActivities: 0,
        totalYogaActivities: 0,
        totalTennisActivities: 0,
        totalFootballActivities: 0,
        totalBasketballActivities: 0,
        totalHorseRidingActivities: 0,
        totalOtherActivities: 0,
        totalActivities: 0,
        totalDuration: 0,
        totalCaloriesBurned: 0,
        totalDistanceAllActivities: 0,
        totalSwimmingLaps: 0,
        totalSwimmingDuration: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageDifficulty: 0,
        averageDuration: 0,
        averageCaloriesPerActivity: 0,
        distanceRecords: {},
        speedRecords: {},
        generalRecords: {},
        lastActivityDate: undefined,
      });
      statistics = await this.userStatisticsRepository.save(statistics);
    }

    return statistics;
  }

  async updateStatisticsForNewActivity(
    activity: Activity,
  ): Promise<UserStatistics> {
    const statistics = await this.getOrCreateStatistics(activity.userLogin);

    // Update activity type specific statistics
    this.updateActivityTypeStats(statistics, activity);

    // Update total counts
    statistics.totalActivities += 1;
    statistics.totalDuration += activity.duration;
    statistics.totalCaloriesBurned += activity.caloriesBurned || 0;

    // Update best records
    this.updateDistanceRecords(statistics, activity);
    this.updateSpeedRecords(statistics, activity);
    this.updateGeneralRecords(statistics, activity);

    // Update averages
    await this.updateAverages(statistics);

    // Update streaks
    this.updateStreaks(statistics, activity);

    return this.userStatisticsRepository.save(statistics);
  }

  async updateStatisticsForUpdatedActivity(
    oldActivity: Activity,
    newActivity: Activity,
  ): Promise<UserStatistics> {
    // For simplicity, recalculate all statistics when an activity is updated
    return this.recalculateAllStatistics(newActivity.userLogin);
  }

  async updateStatisticsForDeletedActivity(
    activity: Activity,
  ): Promise<UserStatistics> {
    // For simplicity, recalculate all statistics when an activity is deleted
    return this.recalculateAllStatistics(activity.userLogin);
  }

  async recalculateAllStatistics(userLogin: string): Promise<UserStatistics> {
    // Get or create statistics record
    let statistics = await this.getOrCreateStatistics(userLogin);

    // Reset all statistics to zero
    statistics = this.resetStatistics(statistics);

    // Get all activities for the user
    const activities = await this.activityRepository.find({
      where: { userLogin },
      order: { activityDate: 'ASC' },
    });

    // Recalculate everything from scratch
    for (const activity of activities) {
      this.updateActivityTypeStats(statistics, activity);
      this.updateDistanceRecords(statistics, activity);
      this.updateSpeedRecords(statistics, activity);
      this.updateGeneralRecords(statistics, activity);
    }

    // Update totals
    statistics.totalActivities = activities.length;
    statistics.totalDuration = activities.reduce(
      (sum, a) => sum + a.duration,
      0,
    );
    statistics.totalCaloriesBurned = activities.reduce(
      (sum, a) => sum + (a.caloriesBurned || 0),
      0,
    );

    // Update averages
    await this.updateAverages(statistics);

    // Update streaks based on activity dates
    this.calculateStreaks(statistics, activities);

    return this.userStatisticsRepository.save(statistics);
  }

  private updateActivityTypeStats(
    statistics: UserStatistics,
    activity: Activity,
  ): void {
    const distance = this.getActivityDistance(activity);

    switch (activity.type) {
      case ActivityType.RUNNING:
        statistics.totalRunningActivities += 1;
        statistics.totalRunningDistance += distance;
        break;
      case ActivityType.SWIMMING:
        statistics.totalSwimmingActivities += 1;
        statistics.totalSwimmingDistance += distance;
        statistics.totalSwimmingDuration += activity.duration;
        if (activity.metadata && 'laps' in activity.metadata) {
          const swimmingMeta = activity.metadata as SwimmingMetadata;
          statistics.totalSwimmingLaps += swimmingMeta.laps;
        }
        break;
      case ActivityType.CYCLING:
        statistics.totalCyclingActivities += 1;
        statistics.totalCyclingDistance += distance;
        break;
      case ActivityType.SKATING:
        statistics.totalSkatingActivities += 1;
        statistics.totalSkatingDistance += distance;
        break;
      case ActivityType.WALKING:
        statistics.totalWalkingActivities += 1;
        statistics.totalWalkingDistance += distance;
        break;
      case ActivityType.HIKING:
        statistics.totalHikingActivities += 1;
        statistics.totalHikingDistance += distance;
        break;
      case ActivityType.GYM_WORKOUT:
        statistics.totalGymWorkoutActivities += 1;
        break;
      case ActivityType.YOGA:
        statistics.totalYogaActivities += 1;
        break;
      case ActivityType.TENNIS:
        statistics.totalTennisActivities += 1;
        break;
      case ActivityType.FOOTBALL:
        statistics.totalFootballActivities += 1;
        break;
      case ActivityType.BASKETBALL:
        statistics.totalBasketballActivities += 1;
        break;
      case ActivityType.HORSE_RIDING:
        statistics.totalHorseRidingActivities += 1;
        break;
      default:
        statistics.totalOtherActivities += 1;
        break;
    }

    if (distance > 0) {
      statistics.totalDistanceAllActivities += distance;
    }
  }

  private getActivityDistance(activity: Activity): number {
    if (activity.metadata && 'distance' in activity.metadata) {
      return activity.metadata.distance as number;
    }

    // For swimming, calculate distance from laps and pool size
    if (
      activity.type === ActivityType.SWIMMING &&
      activity.metadata &&
      'laps' in activity.metadata &&
      'poolSize' in activity.metadata
    ) {
      const swimmingMeta = activity.metadata as SwimmingMetadata;
      return (swimmingMeta.laps * swimmingMeta.poolSize) / 1000; // Convert to km
    }

    return 0;
  }

  private updateDistanceRecords(
    statistics: UserStatistics,
    activity: Activity,
  ): void {
    const distance = this.getActivityDistance(activity);
    if (distance <= 0) return;

    if (!statistics.distanceRecords) {
      statistics.distanceRecords = {};
    }

    const record: BestRecord = {
      value: distance,
      unit: 'km',
      activityId: activity.id,
      achievedAt: activity.activityDate,
      activityTitle: activity.title,
    };

    switch (activity.type) {
      case ActivityType.RUNNING:
        if (
          !statistics.distanceRecords.longestRun ||
          distance > statistics.distanceRecords.longestRun.value
        ) {
          statistics.distanceRecords.longestRun = record;
        }
        break;
      case ActivityType.SWIMMING:
        if (
          !statistics.distanceRecords.longestSwim ||
          distance > statistics.distanceRecords.longestSwim.value
        ) {
          statistics.distanceRecords.longestSwim = record;
        }
        break;
      case ActivityType.CYCLING:
        if (
          !statistics.distanceRecords.longestCycle ||
          distance > statistics.distanceRecords.longestCycle.value
        ) {
          statistics.distanceRecords.longestCycle = record;
        }
        break;
      case ActivityType.SKATING:
        if (
          !statistics.distanceRecords.longestSkate ||
          distance > statistics.distanceRecords.longestSkate.value
        ) {
          statistics.distanceRecords.longestSkate = record;
        }
        break;
      case ActivityType.WALKING:
        if (
          !statistics.distanceRecords.longestWalk ||
          distance > statistics.distanceRecords.longestWalk.value
        ) {
          statistics.distanceRecords.longestWalk = record;
        }
        break;
      case ActivityType.HIKING:
        if (
          !statistics.distanceRecords.longestHike ||
          distance > statistics.distanceRecords.longestHike.value
        ) {
          statistics.distanceRecords.longestHike = record;
        }
        break;
    }
  }

  private updateSpeedRecords(
    statistics: UserStatistics,
    activity: Activity,
  ): void {
    if (!statistics.speedRecords) {
      statistics.speedRecords = {};
    }

    // Running pace (min/km - lower is better)
    if (
      activity.type === ActivityType.RUNNING &&
      activity.metadata &&
      'pace' in activity.metadata
    ) {
      const runningMeta = activity.metadata as RunningMetadata;
      if (runningMeta.pace) {
        const record: BestRecord = {
          value: runningMeta.pace,
          unit: 'min/km',
          activityId: activity.id,
          achievedAt: activity.activityDate,
          activityTitle: activity.title,
        };

        if (
          !statistics.speedRecords.fastestRunPace ||
          runningMeta.pace < statistics.speedRecords.fastestRunPace.value
        ) {
          statistics.speedRecords.fastestRunPace = record;
        }
      }
    }

    // Cycling speed (km/h - higher is better)
    if (
      activity.type === ActivityType.CYCLING &&
      activity.metadata &&
      'avgSpeed' in activity.metadata
    ) {
      const cyclingMeta = activity.metadata as CyclingMetadata;
      if (cyclingMeta.avgSpeed) {
        const record: BestRecord = {
          value: cyclingMeta.avgSpeed,
          unit: 'km/h',
          activityId: activity.id,
          achievedAt: activity.activityDate,
          activityTitle: activity.title,
        };

        if (
          !statistics.speedRecords.fastestCyclingSpeed ||
          cyclingMeta.avgSpeed >
            statistics.speedRecords.fastestCyclingSpeed.value
        ) {
          statistics.speedRecords.fastestCyclingSpeed = record;
        }
      }
    }
  }

  private updateGeneralRecords(
    statistics: UserStatistics,
    activity: Activity,
  ): void {
    if (!statistics.generalRecords) {
      statistics.generalRecords = {};
    }

    // Most calories burned in single activity
    if (activity.caloriesBurned) {
      const record: BestRecord = {
        value: activity.caloriesBurned,
        unit: 'calories',
        activityId: activity.id,
        achievedAt: activity.activityDate,
        activityTitle: activity.title,
      };

      if (
        !statistics.generalRecords.mostCaloriesBurned ||
        activity.caloriesBurned >
          statistics.generalRecords.mostCaloriesBurned.value
      ) {
        statistics.generalRecords.mostCaloriesBurned = record;
      }
    }

    // Longest duration
    const record: BestRecord = {
      value: activity.duration,
      unit: 'minutes',
      activityId: activity.id,
      achievedAt: activity.activityDate,
      activityTitle: activity.title,
    };

    if (
      !statistics.generalRecords.longestDuration ||
      activity.duration > statistics.generalRecords.longestDuration.value
    ) {
      statistics.generalRecords.longestDuration = record;
    }

    // Hardest difficulty - convert to numeric for comparison
    const difficultyValue = this.getDifficultyNumericValue(activity.difficulty);
    const difficultyRecord: BestRecord = {
      value: difficultyValue,
      unit: 'level',
      activityId: activity.id,
      achievedAt: activity.activityDate,
      activityTitle: activity.title,
    };

    if (
      !statistics.generalRecords.hardestDifficulty ||
      difficultyValue > statistics.generalRecords.hardestDifficulty.value
    ) {
      statistics.generalRecords.hardestDifficulty = difficultyRecord;
    }
  }

  private getDifficultyNumericValue(difficulty: DifficultyLevel): number {
    switch (difficulty) {
      case DifficultyLevel.VERY_EASY:
        return 1;
      case DifficultyLevel.EASY:
        return 2;
      case DifficultyLevel.MODERATE:
        return 3;
      case DifficultyLevel.HARD:
        return 4;
      case DifficultyLevel.VERY_HARD:
        return 5;
      default:
        return 1;
    }
  }

  private async updateAverages(statistics: UserStatistics): Promise<void> {
    if (statistics.totalActivities > 0) {
      statistics.averageDuration =
        Math.round(
          (statistics.totalDuration / statistics.totalActivities) * 100,
        ) / 100;
      statistics.averageCaloriesPerActivity =
        Math.round(
          (statistics.totalCaloriesBurned / statistics.totalActivities) * 100,
        ) / 100;

      // Calculate average difficulty from all activities
      const activities = await this.activityRepository.find({
        where: { userLogin: statistics.userLogin },
      });

      if (activities.length > 0) {
        const totalDifficulty = activities.reduce(
          (sum, a) => sum + this.getDifficultyNumericValue(a.difficulty),
          0,
        );
        statistics.averageDifficulty =
          Math.round((totalDifficulty / activities.length) * 100) / 100;
      }
    }
  }

  private updateStreaks(statistics: UserStatistics, activity: Activity): void {
    // This is a simplified implementation
    // For a complete implementation, we would need to check consecutive days
    statistics.lastActivityDate = activity.activityDate;

    // For now, just increment current streak if activity is from today or yesterday
    const today = new Date();
    const activityDate = new Date(activity.activityDate);
    const diffTime = Math.abs(today.getTime() - activityDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      statistics.currentStreak = Math.max(statistics.currentStreak, 1);
      statistics.longestStreak = Math.max(
        statistics.longestStreak,
        statistics.currentStreak,
      );
    }
  }

  private calculateStreaks(
    statistics: UserStatistics,
    activities: Activity[],
  ): void {
    if (activities.length === 0) {
      statistics.currentStreak = 0;
      statistics.longestStreak = 0;
      return;
    }

    // Sort activities by date - ensure dates are properly converted to Date objects
    const sortedActivities = activities.sort((a, b) => {
      const dateA = new Date(a.activityDate);
      const dateB = new Date(b.activityDate);
      return dateA.getTime() - dateB.getTime();
    });

    let currentStreak = 0;
    let longestStreak = 0;
    let lastDate: Date | null = null;

    // Get unique activity dates - ensure proper date conversion
    const uniqueDates = [
      ...new Set(
        sortedActivities.map((a) => new Date(a.activityDate).toDateString()),
      ),
    ];

    for (let i = 0; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i]);

      if (lastDate === null) {
        currentStreak = 1;
      } else {
        const diffTime = currentDate.getTime() - lastDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
          // Consecutive day
          currentStreak++;
        } else {
          // Gap in activities
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      }

      lastDate = currentDate;
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    // Check if current streak is still active (last activity within last 2 days)
    const now = new Date();
    const lastActivityDate = new Date(uniqueDates[uniqueDates.length - 1]);
    const daysSinceLastActivity =
      (now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24);

    statistics.longestStreak = longestStreak;
    statistics.currentStreak = daysSinceLastActivity <= 2 ? currentStreak : 0;
    statistics.lastActivityDate = lastActivityDate;
  }

  private resetStatistics(statistics: UserStatistics): UserStatistics {
    // Reset all counters to zero while preserving ID and userLogin
    const userLogin = statistics.userLogin;
    const id = statistics.id;

    Object.assign(statistics, {
      id,
      userLogin,
      totalRunningDistance: 0,
      totalSwimmingDistance: 0,
      totalCyclingDistance: 0,
      totalSkatingDistance: 0,
      totalWalkingDistance: 0,
      totalHikingDistance: 0,
      totalRunningActivities: 0,
      totalSwimmingActivities: 0,
      totalCyclingActivities: 0,
      totalSkatingActivities: 0,
      totalWalkingActivities: 0,
      totalHikingActivities: 0,
      totalGymWorkoutActivities: 0,
      totalYogaActivities: 0,
      totalTennisActivities: 0,
      totalFootballActivities: 0,
      totalBasketballActivities: 0,
      totalHorseRidingActivities: 0,
      totalOtherActivities: 0,
      totalActivities: 0,
      totalDuration: 0,
      totalCaloriesBurned: 0,
      totalDistanceAllActivities: 0,
      totalSwimmingLaps: 0,
      totalSwimmingDuration: 0,
      currentStreak: 0,
      longestStreak: 0,
      averageDifficulty: 0,
      averageDuration: 0,
      averageCaloriesPerActivity: 0,
      distanceRecords: {},
      speedRecords: {},
      generalRecords: {},
      lastActivityDate: null,
    });

    return statistics;
  }
}
