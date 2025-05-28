import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import {
  Activity,
  ActivityType,
  DifficultyLevel,
} from '../../entities/activity.entity';

export interface ActivityFilterOptions {
  type?: ActivityType;
  difficulty?: DifficultyLevel;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class ActivityQueryService {
  /**
   * Build query options for finding activities with filters
   */
  buildFindAllQuery(
    userLogin: string,
    options?: ActivityFilterOptions,
  ): FindManyOptions<Activity> {
    const queryOptions: FindManyOptions<Activity> = {
      where: { userLogin },
      order: { activityDate: 'DESC', createdAt: 'DESC' },
    };

    if (!options) {
      return queryOptions;
    }

    // Apply type filter
    if (options.type) {
      queryOptions.where = { ...queryOptions.where, type: options.type };
    }

    // Apply difficulty filter
    if (options.difficulty) {
      queryOptions.where = {
        ...queryOptions.where,
        difficulty: options.difficulty,
      };
    }

    // Apply date range filter
    if (options.dateFrom || options.dateTo) {
      const dateFilter = this.buildDateFilter(options.dateFrom, options.dateTo);
      queryOptions.where = { ...queryOptions.where, ...dateFilter };
    }

    // Apply pagination
    if (options.limit) {
      queryOptions.take = options.limit;
    }

    if (options.offset) {
      queryOptions.skip = options.offset;
    }

    return queryOptions;
  }

  /**
   * Build date filter conditions
   */
  private buildDateFilter(dateFrom?: string, dateTo?: string): any {
    const dateFilter: any = {};

    if (dateFrom) {
      dateFilter.activityDate = {
        ...dateFilter.activityDate,
        gte: new Date(dateFrom),
      };
    }

    if (dateTo) {
      dateFilter.activityDate = {
        ...dateFilter.activityDate,
        lte: new Date(dateTo),
      };
    }

    return dateFilter;
  }

  /**
   * Build query options for recent activities
   */
  buildRecentActivitiesQuery(
    userLogin: string,
    limit: number = 10,
  ): FindManyOptions<Activity> {
    return {
      where: { userLogin },
      order: { activityDate: 'DESC', createdAt: 'DESC' },
      take: limit,
    };
  }

  /**
   * Find activities with the built query options
   */
  async findActivitiesWithQuery(
    repository: Repository<Activity>,
    queryOptions: FindManyOptions<Activity>,
  ): Promise<{ activities: Activity[]; total: number }> {
    const [activities, total] = await repository.findAndCount(queryOptions);
    return { activities, total };
  }

  /**
   * Find activities for statistics (without pagination)
   */
  async findActivitiesForStatistics(
    repository: Repository<Activity>,
    userLogin: string,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<Activity[]> {
    const whereCondition: any = { userLogin };

    if (dateFrom || dateTo) {
      const dateFilter = this.buildDateFilterForStatistics(dateFrom, dateTo);
      Object.assign(whereCondition, dateFilter);
    }

    return repository.find({ where: whereCondition });
  }

  /**
   * Build date filter for statistics queries
   */
  private buildDateFilterForStatistics(
    dateFrom?: string,
    dateTo?: string,
  ): any {
    if (dateFrom && dateTo) {
      return {
        activityDate: {
          gte: new Date(dateFrom),
          lte: new Date(dateTo),
        },
      };
    } else if (dateFrom) {
      return {
        activityDate: { gte: new Date(dateFrom) },
      };
    } else if (dateTo) {
      return {
        activityDate: { lte: new Date(dateTo) },
      };
    }
    return {};
  }
}
