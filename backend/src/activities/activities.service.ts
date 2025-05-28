import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Repository } from 'typeorm';
import {
  Activity,
  ActivityType,
  DifficultyLevel,
  ActivityMetadata,
  SwimmingMetadata,
  RunningMetadata,
  CyclingMetadata,
  SkatingMetadata,
  GymWorkoutMetadata,
} from '../entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  /**
   * Calculate calories burned based on metadata and activity details
   */
  private calculateCalories(
    type: ActivityType,
    duration: number, // in minutes
    difficulty: DifficultyLevel,
    metadata?: ActivityMetadata,
  ): number {
    // Try to calculate from metadata first
    const metadataCalories = this.calculateCaloriesFromMetadata(
      type,
      duration,
      metadata,
    );
    if (metadataCalories > 0) {
      return Math.round(
        metadataCalories * this.getDifficultyMultiplier(difficulty),
      );
    }

    // Fallback to general estimates based on activity type and difficulty
    return this.calculateCaloriesFromGeneral(type, duration, difficulty);
  }

  /**
   * Calculate calories from specific metadata
   */
  private calculateCaloriesFromMetadata(
    type: ActivityType,
    duration: number,
    metadata?: ActivityMetadata,
  ): number {
    if (!metadata) return 0;

    switch (type) {
      case ActivityType.RUNNING: {
        const runningMeta = metadata as RunningMetadata;
        if (runningMeta.distance && runningMeta.pace) {
          // More accurate calculation based on distance and pace
          // Average: 100 calories per mile (1.6 km), adjusted for pace
          const baseCaloriesPerKm = 62.5;
          const paceMultiplier = Math.max(
            0.7,
            Math.min(1.5, 8 / runningMeta.pace),
          );
          return runningMeta.distance * baseCaloriesPerKm * paceMultiplier;
        }
        break;
      }

      case ActivityType.SWIMMING: {
        const swimmingMeta = metadata as SwimmingMetadata;
        if (swimmingMeta.poolSize && swimmingMeta.laps) {
          // Calculate distance and estimate calories
          const distanceKm = (swimmingMeta.poolSize * swimmingMeta.laps) / 1000;
          // Swimming burns more calories per km than running
          const caloriesPerKm = 400;
          return distanceKm * caloriesPerKm;
        }
        break;
      }

      case ActivityType.CYCLING: {
        const cyclingMeta = metadata as CyclingMetadata;
        if (cyclingMeta.distance && cyclingMeta.avgSpeed) {
          // Calories based on distance and speed
          const baseCaloriesPerKm = 25;
          const speedMultiplier = Math.max(
            0.8,
            Math.min(1.8, cyclingMeta.avgSpeed / 20),
          );
          return cyclingMeta.distance * baseCaloriesPerKm * speedMultiplier;
        }
        break;
      }

      case ActivityType.SKATING: {
        const skatingMeta = metadata as SkatingMetadata;
        if (skatingMeta.distance) {
          // Skating calories similar to cycling but slightly higher
          const caloriesPerKm = 35;
          return skatingMeta.distance * caloriesPerKm;
        }
        break;
      }

      case ActivityType.GYM_WORKOUT: {
        const gymMeta = metadata as GymWorkoutMetadata;
        if (gymMeta.workoutType) {
          // Different rates for different workout types
          const ratesPerMinute = {
            strength: 6,
            cardio: 10,
            mixed: 8,
          };
          return duration * ratesPerMinute[gymMeta.workoutType];
        }
        break;
      }
    }

    return 0;
  }

  /**
   * Calculate calories using general estimates
   */
  private calculateCaloriesFromGeneral(
    type: ActivityType,
    duration: number,
    difficulty: DifficultyLevel,
  ): number {
    // MET (Metabolic Equivalent) values for different activities
    const metValues: Record<ActivityType, number> = {
      [ActivityType.RUNNING]: 8.0,
      [ActivityType.SWIMMING]: 10.0,
      [ActivityType.CYCLING]: 6.0,
      [ActivityType.SKATING]: 5.5,
      [ActivityType.HORSE_RIDING]: 4.0,
      [ActivityType.WALKING]: 3.5,
      [ActivityType.HIKING]: 6.0,
      [ActivityType.GYM_WORKOUT]: 6.5,
      [ActivityType.YOGA]: 2.5,
      [ActivityType.TENNIS]: 7.0,
      [ActivityType.FOOTBALL]: 8.0,
      [ActivityType.BASKETBALL]: 6.5,
      [ActivityType.OTHER]: 4.0,
    };

    const baseMET = metValues[type];
    const difficultyMultiplier = this.getDifficultyMultiplier(difficulty);
    const adjustedMET = baseMET * difficultyMultiplier;

    // Average person weight: 70kg
    // Calories = MET × weight(kg) × time(hours)
    const averageWeight = 70;
    const timeInHours = duration / 60;

    return Math.round(adjustedMET * averageWeight * timeInHours);
  }

  /**
   * Get multiplier based on difficulty level
   */
  private getDifficultyMultiplier(difficulty: DifficultyLevel): number {
    const multipliers = {
      [DifficultyLevel.VERY_EASY]: 0.7,
      [DifficultyLevel.EASY]: 0.85,
      [DifficultyLevel.MODERATE]: 1.0,
      [DifficultyLevel.HARD]: 1.2,
      [DifficultyLevel.VERY_HARD]: 1.4,
    };
    return multipliers[difficulty];
  }

  /**
   * Create a new activity for the user
   */
  async create(
    userLogin: string,
    createActivityDto: CreateActivityDto,
  ): Promise<Activity> {
    // Calculate calories if not provided
    let caloriesBurned = createActivityDto.caloriesBurned;
    if (caloriesBurned === undefined || caloriesBurned === null) {
      caloriesBurned = this.calculateCalories(
        createActivityDto.type,
        createActivityDto.duration,
        createActivityDto.difficulty,
        createActivityDto.metadata,
      );
    }

    const activity = this.activityRepository.create({
      ...createActivityDto,
      userLogin,
      activityDate: new Date(createActivityDto.activityDate),
      caloriesBurned,
    });

    return this.activityRepository.save(activity);
  }

  /**
   * Find all activities for a user with optional filtering
   */
  async findAll(
    userLogin: string,
    options?: {
      type?: ActivityType;
      difficulty?: DifficultyLevel;
      dateFrom?: string;
      dateTo?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<{ activities: Activity[]; total: number }> {
    const queryOptions: FindManyOptions<Activity> = {
      where: { userLogin },
      order: { activityDate: 'DESC', createdAt: 'DESC' },
    };

    // Apply filters
    if (options?.type) {
      queryOptions.where = { ...queryOptions.where, type: options.type };
    }

    if (options?.difficulty) {
      queryOptions.where = {
        ...queryOptions.where,
        difficulty: options.difficulty,
      };
    }

    if (options?.dateFrom || options?.dateTo) {
      const dateFilter: any = {};
      if (options.dateFrom) {
        dateFilter.activityDate = {
          ...dateFilter.activityDate,
          gte: new Date(options.dateFrom),
        };
      }
      if (options.dateTo) {
        dateFilter.activityDate = {
          ...dateFilter.activityDate,
          lte: new Date(options.dateTo),
        };
      }
      queryOptions.where = { ...queryOptions.where, ...dateFilter };
    }

    if (options?.limit) {
      queryOptions.take = options.limit;
    }

    if (options?.offset) {
      queryOptions.skip = options.offset;
    }

    const [activities, total] =
      await this.activityRepository.findAndCount(queryOptions);

    return { activities, total };
  }

  /**
   * Find a specific activity by ID
   */
  async findOne(id: string, userLogin: string): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { id, userLogin },
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    return activity;
  }

  /**
   * Update an activity
   */
  async update(
    id: string,
    userLogin: string,
    updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    const activity = await this.findOne(id, userLogin);

    const updateData = { ...updateActivityDto };
    if (updateActivityDto.activityDate) {
      updateData.activityDate = new Date(updateActivityDto.activityDate) as any;
    }

    await this.activityRepository.update(id, updateData);

    return this.findOne(id, userLogin);
  }

  /**
   * Delete an activity
   */
  async remove(id: string, userLogin: string): Promise<void> {
    const activity = await this.findOne(id, userLogin);
    await this.activityRepository.remove(activity);
  }

  /**
   * Get activity statistics for a user
   */
  async getStatistics(
    userLogin: string,
    options?: {
      dateFrom?: string;
      dateTo?: string;
    },
  ): Promise<{
    totalActivities: number;
    totalDuration: number;
    averageDifficulty: number;
    activitiesByType: Record<ActivityType, number>;
    activitiesByDifficulty: Record<DifficultyLevel, number>;
    totalCaloriesBurned: number;
  }> {
    const whereCondition: any = { userLogin };

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

    const activities = await this.activityRepository.find({
      where: whereCondition,
    });

    const totalActivities = activities.length;
    const totalDuration = activities.reduce(
      (sum, activity) => sum + activity.duration,
      0,
    );
    const averageDifficulty =
      totalActivities > 0
        ? activities.reduce((sum, activity) => sum + activity.difficulty, 0) /
          totalActivities
        : 0;

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
   * Get recent activities for a user
   */
  async getRecentActivities(
    userLogin: string,
    limit: number = 10,
  ): Promise<Activity[]> {
    return this.activityRepository.find({
      where: { userLogin },
      order: { activityDate: 'DESC', createdAt: 'DESC' },
      take: limit,
    });
  }
}
