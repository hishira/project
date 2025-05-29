import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CalorieCalculationService } from './services/calorie-calculation.service';
import {
  ActivityQueryService,
  ActivityFilterOptions,
} from './services/activity-query.service';
import {
  ActivityStatisticsService,
  ActivityStatistics,
} from './services/activity-statistics.service';
import { UserStatisticsService } from '../user-statistics/user-statistics.service';
import { LoggerService } from '../common/logger';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    private readonly calorieCalculationService: CalorieCalculationService,
    private readonly activityQueryService: ActivityQueryService,
    private readonly activityStatisticsService: ActivityStatisticsService,
    private readonly userStatisticsService: UserStatisticsService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Create a new activity for the user
   */
  async create(
    userLogin: string,
    createActivityDto: CreateActivityDto,
  ): Promise<Activity> {
    this.logger.logInfo('Creating new activity', {
      module: 'ActivitiesService',
      action: 'create',
      userLogin,
      activityType: createActivityDto.type,
    });

    // Calculate calories if not provided
    let caloriesBurned = createActivityDto.caloriesBurned;
    if (caloriesBurned === undefined || caloriesBurned === null) {
      caloriesBurned = this.calorieCalculationService.calculateCalories(
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

    const savedActivity = await this.activityRepository.save(activity);

    this.logger.logBusiness('Activity created successfully', {
      module: 'ActivitiesService',
      action: 'create',
      userLogin,
      activityId: savedActivity.id,
      activityType: savedActivity.type,
      duration: savedActivity.duration,
      caloriesBurned: savedActivity.caloriesBurned,
    });

    // Update user statistics
    await this.userStatisticsService.updateStatisticsForNewActivity(
      savedActivity,
    );

    return savedActivity;
  }

  /**
   * Find all activities for a user with optional filtering
   */
  async findAll(
    userLogin: string,
    options?: ActivityFilterOptions,
  ): Promise<{ activities: Activity[]; total: number }> {
    this.logger.logInfo('Fetching activities for user', {
      module: 'ActivitiesService',
      action: 'findAll',
      userLogin,
      filters: options,
    });

    const queryOptions = this.activityQueryService.buildFindAllQuery(
      userLogin,
      options,
    );
    const result = await this.activityQueryService.findActivitiesWithQuery(
      this.activityRepository,
      queryOptions,
    );

    this.logger.logInfo(`Found ${result.total} activities for user`, {
      module: 'ActivitiesService',
      action: 'findAll',
      userLogin,
      totalFound: result.total,
    });

    return result;
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
    const oldActivity = await this.findOne(id, userLogin);

    const { activityDate, ...otherUpdates } = updateActivityDto;
    const updateData: any = { ...otherUpdates };

    if (activityDate) {
      // @ts-ignore: Intentional type override for date conversion
      updateData.activityDate = new Date(activityDate);
    }

    // Recalculate calories if relevant fields changed but calories not provided
    if (
      (updateActivityDto.type !== undefined ||
        updateActivityDto.duration !== undefined ||
        updateActivityDto.difficulty !== undefined ||
        updateActivityDto.metadata !== undefined) &&
      updateActivityDto.caloriesBurned === undefined
    ) {
      // @ts-ignore: Intentional type override for calculated calories
      updateData.caloriesBurned =
        this.calorieCalculationService.calculateCalories(
          updateActivityDto.type ?? oldActivity.type,
          updateActivityDto.duration ?? oldActivity.duration,
          updateActivityDto.difficulty ?? oldActivity.difficulty,
          updateActivityDto.metadata ?? oldActivity.metadata,
        );
    }

    // @ts-ignore: updateData is correctly typed for the repository update
    await this.activityRepository.update(id, updateData);
    const updatedActivity = await this.findOne(id, userLogin);

    // Update user statistics
    await this.userStatisticsService.updateStatisticsForUpdatedActivity(
      oldActivity,
      updatedActivity,
    );

    return updatedActivity;
  }

  /**
   * Delete an activity
   */
  async remove(id: string, userLogin: string): Promise<void> {
    this.logger.logInfo('Deleting activity', {
      module: 'ActivitiesService',
      action: 'remove',
      userLogin,
      activityId: id,
    });

    const activity = await this.findOne(id, userLogin);
    await this.activityRepository.remove(activity);

    this.logger.logBusiness('Activity deleted successfully', {
      module: 'ActivitiesService',
      action: 'remove',
      userLogin,
      activityId: id,
      activityType: activity.type,
    });

    // Update user statistics
    await this.userStatisticsService.updateStatisticsForDeletedActivity(
      activity,
    );
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
  ): Promise<ActivityStatistics> {
    return this.activityStatisticsService.getStatistics(
      this.activityRepository,
      userLogin,
      options,
    );
  }

  /**
   * Get recent activities for a user
   */
  async getRecentActivities(
    userLogin: string,
    limit: number = 10,
  ): Promise<Activity[]> {
    const queryOptions = this.activityQueryService.buildRecentActivitiesQuery(
      userLogin,
      limit,
    );
    const result = await this.activityQueryService.findActivitiesWithQuery(
      this.activityRepository,
      queryOptions,
    );
    return result.activities;
  }
}
