import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CalorieCalculationService } from './services/calorie-calculation.service';
import { 
  ActivityQueryService, 
  ActivityFilterOptions 
} from './services/activity-query.service';
import { 
  ActivityStatisticsService, 
  ActivityStatistics 
} from './services/activity-statistics.service';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    private readonly calorieCalculationService: CalorieCalculationService,
    private readonly activityQueryService: ActivityQueryService,
    private readonly activityStatisticsService: ActivityStatisticsService,
  ) {}

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

    return this.activityRepository.save(activity);
  }

  /**
   * Find all activities for a user with optional filtering
   */
  async findAll(
    userLogin: string,
    options?: ActivityFilterOptions,
  ): Promise<{ activities: Activity[]; total: number }> {
    const queryOptions = this.activityQueryService.buildFindAllQuery(userLogin, options);
    return this.activityQueryService.findActivitiesWithQuery(
      this.activityRepository,
      queryOptions,
    );
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

    // Recalculate calories if relevant fields changed but calories not provided
    if (
      (updateActivityDto.type !== undefined ||
       updateActivityDto.duration !== undefined ||
       updateActivityDto.difficulty !== undefined ||
       updateActivityDto.metadata !== undefined) &&
      updateActivityDto.caloriesBurned === undefined
    ) {
      updateData.caloriesBurned = this.calorieCalculationService.calculateCalories(
        updateActivityDto.type ?? activity.type,
        updateActivityDto.duration ?? activity.duration,
        updateActivityDto.difficulty ?? activity.difficulty,
        updateActivityDto.metadata ?? activity.metadata,
      );
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
    const queryOptions = this.activityQueryService.buildRecentActivitiesQuery(userLogin, limit);
    const result = await this.activityQueryService.findActivitiesWithQuery(
      this.activityRepository,
      queryOptions,
    );
    return result.activities;
  }
}
