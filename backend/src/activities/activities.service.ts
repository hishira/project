import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Repository } from 'typeorm';
import {
  Activity,
  ActivityType,
  DifficultyLevel,
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
   * Create a new activity for the user
   */
  async create(
    userLogin: string,
    createActivityDto: CreateActivityDto,
  ): Promise<Activity> {
    const activity = this.activityRepository.create({
      ...createActivityDto,
      userLogin,
      activityDate: new Date(createActivityDto.activityDate),
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
