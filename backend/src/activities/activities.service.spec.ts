import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { Activity, ActivityType, DifficultyLevel } from '../entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CalorieCalculationService } from './services/calorie-calculation.service';
import { ActivityQueryService } from './services/activity-query.service';
import { ActivityStatisticsService } from './services/activity-statistics.service';

describe('ActivitiesService', () => {
  let service: ActivitiesService;
  let module: TestingModule;
  let repository: jest.Mocked<Repository<Activity>>;

  const mockActivity: Partial<Activity> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    type: ActivityType.RUNNING,
    title: 'Morning Run',
    description: 'A nice morning run in the park',
    duration: 30,
    difficulty: DifficultyLevel.MODERATE,
    activityDate: new Date('2024-01-15'),
    userLogin: 'testuser',
    metadata: {
      location: 'outdoor',
      distance: 5,
      pace: 6,
    },
    caloriesBurned: 300,
    notes: 'Felt great!',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ActivitiesService,
        {
          provide: getRepositoryToken(Activity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: CalorieCalculationService,
          useValue: {
            calculateCalories: jest.fn().mockReturnValue(300),
          },
        },
        {
          provide: ActivityQueryService,
          useValue: {
            buildFindAllQuery: jest.fn().mockReturnValue({}),
            buildRecentActivitiesQuery: jest.fn().mockReturnValue({}),
            findActivitiesWithQuery: jest.fn().mockResolvedValue({ activities: [], total: 0 }),
          },
        },
        {
          provide: ActivityStatisticsService,
          useValue: {
            calculateStatistics: jest.fn().mockReturnValue({
              totalActivities: 0,
              totalDuration: 0,
              averageDifficulty: 0,
              activitiesByType: {},
              activitiesByDifficulty: {},
              totalCaloriesBurned: 0,
            }),
            getStatistics: jest.fn().mockResolvedValue({
              totalActivities: 0,
              totalDuration: 0,
              averageDifficulty: 0,
              activitiesByType: {},
              activitiesByDifficulty: {},
              totalCaloriesBurned: 0,
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
    repository = module.get(getRepositoryToken(Activity));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new activity', async () => {
      const createActivityDto: CreateActivityDto = {
        type: ActivityType.RUNNING,
        title: 'Morning Run',
        description: 'A nice morning run',
        duration: 30,
        difficulty: DifficultyLevel.MODERATE,
        activityDate: '2024-01-15',
        metadata: { location: 'outdoor', distance: 5 },
        caloriesBurned: 300,
        notes: 'Felt great!',
      };

      repository.create.mockReturnValue(mockActivity as Activity);
      repository.save.mockResolvedValue(mockActivity as Activity);

      const result = await service.create('testuser', createActivityDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createActivityDto,
        userLogin: 'testuser',
        activityDate: new Date('2024-01-15'),
      });
      expect(repository.save).toHaveBeenCalledWith(mockActivity);
      expect(result).toEqual(mockActivity);
    });
  });

  describe('findAll', () => {
    it('should return activities for a user', async () => {
      const activities = [mockActivity as Activity];
      const queryOptions = { where: { userLogin: 'testuser' } };
      
      const mockQueryService = module.get(ActivityQueryService) as jest.Mocked<ActivityQueryService>;
      (mockQueryService.buildFindAllQuery as jest.Mock).mockReturnValue(queryOptions);
      (mockQueryService.findActivitiesWithQuery as jest.Mock).mockResolvedValue({ activities, total: 1 });

      const result = await service.findAll('testuser');

      expect(mockQueryService.buildFindAllQuery).toHaveBeenCalledWith('testuser', undefined);
      expect(mockQueryService.findActivitiesWithQuery).toHaveBeenCalledWith(
        repository,
        queryOptions,
      );
      expect(result).toEqual({ activities, total: 1 });
    });

    it('should apply filters when provided', async () => {
      const activities = [mockActivity as Activity];
      const filters = {
        type: ActivityType.RUNNING,
        difficulty: DifficultyLevel.MODERATE,
        limit: 10,
        offset: 1,
      };
      const queryOptions = { 
        where: { 
          userLogin: 'testuser',
          type: ActivityType.RUNNING,
          difficulty: DifficultyLevel.MODERATE,
        },
        take: 10,
        skip: 1,
      };
      
      const mockQueryService = module.get(ActivityQueryService) as jest.Mocked<ActivityQueryService>;
      (mockQueryService.buildFindAllQuery as jest.Mock).mockReturnValue(queryOptions);
      (mockQueryService.findActivitiesWithQuery as jest.Mock).mockResolvedValue({ activities, total: 1 });

      const result = await service.findAll('testuser', filters);

      expect(mockQueryService.buildFindAllQuery).toHaveBeenCalledWith('testuser', filters);
      expect(mockQueryService.findActivitiesWithQuery).toHaveBeenCalledWith(
        repository,
        queryOptions,
      );
      expect(result).toEqual({ activities, total: 1 });
    });
  });

  describe('findOne', () => {
    it('should return an activity by id', async () => {
      repository.findOne.mockResolvedValue(mockActivity as Activity);

      const result = await service.findOne('123e4567-e89b-12d3-a456-426614174000', 'testuser');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000', userLogin: 'testuser' },
      });
      expect(result).toEqual(mockActivity);
    });

    it('should throw NotFoundException if activity not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.findOne('non-existent-id', 'testuser'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an activity', async () => {
      const updateActivityDto: UpdateActivityDto = {
        title: 'Updated Run',
        duration: 45,
      };

      repository.findOne
        .mockResolvedValueOnce(mockActivity as Activity)
        .mockResolvedValueOnce({ 
          ...mockActivity, 
          ...updateActivityDto,
          caloriesBurned: 300, // Mock the calculated calories
        } as Activity);
      repository.update.mockResolvedValue({ affected: 1, generatedMaps: [], raw: [] });

      const result = await service.update(
        '123e4567-e89b-12d3-a456-426614174000',
        'testuser',
        updateActivityDto,
      );

      expect(repository.update).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        { ...updateActivityDto, caloriesBurned: 300 },
      );
      expect(result.title).toBe('Updated Run');
      expect(result.duration).toBe(45);
    });
  });

  describe('remove', () => {
    it('should remove an activity', async () => {
      repository.findOne.mockResolvedValue(mockActivity as Activity);
      repository.remove.mockResolvedValue(mockActivity as Activity);

      await service.remove('123e4567-e89b-12d3-a456-426614174000', 'testuser');

      expect(repository.remove).toHaveBeenCalledWith(mockActivity);
    });
  });

  describe('getStatistics', () => {
    it('should return activity statistics', async () => {
      const expectedStats = {
        totalActivities: 2,
        totalDuration: 75,
        averageDifficulty: 3.5,
        activitiesByType: {
          [ActivityType.RUNNING]: 1,
          [ActivityType.SWIMMING]: 1,
        },
        activitiesByDifficulty: {
          [DifficultyLevel.MODERATE]: 1,
          [DifficultyLevel.HARD]: 1,
        },
        totalCaloriesBurned: 700,
      };

      const mockStatsService = module.get(ActivityStatisticsService) as jest.Mocked<ActivityStatisticsService>;
      (mockStatsService.getStatistics as jest.Mock).mockResolvedValue(expectedStats);

      const result = await service.getStatistics('testuser');

      expect(mockStatsService.getStatistics).toHaveBeenCalledWith(
        repository,
        'testuser',
        undefined,
      );
      expect(result).toEqual(expectedStats);
    });

    it('should handle empty statistics', async () => {
      const expectedStats = {
        totalActivities: 0,
        totalDuration: 0,
        averageDifficulty: 0,
        activitiesByType: {},
        activitiesByDifficulty: {},
        totalCaloriesBurned: 0,
      };

      const mockStatsService = module.get(ActivityStatisticsService) as jest.Mocked<ActivityStatisticsService>;
      (mockStatsService.getStatistics as jest.Mock).mockResolvedValue(expectedStats);

      const result = await service.getStatistics('testuser');

      expect(result).toEqual(expectedStats);
    });
  });

  describe('getRecentActivities', () => {
    it('should return recent activities', async () => {
      const activities = [mockActivity as Activity];
      const queryOptions = { 
        where: { userLogin: 'testuser' },
        order: { activityDate: 'DESC', createdAt: 'DESC' },
        take: 5,
      };

      const mockQueryService = module.get(ActivityQueryService) as jest.Mocked<ActivityQueryService>;
      (mockQueryService.buildRecentActivitiesQuery as jest.Mock).mockReturnValue(queryOptions);
      (mockQueryService.findActivitiesWithQuery as jest.Mock).mockResolvedValue({ activities, total: 1 });

      const result = await service.getRecentActivities('testuser', 5);

      expect(mockQueryService.buildRecentActivitiesQuery).toHaveBeenCalledWith('testuser', 5);
      expect(mockQueryService.findActivitiesWithQuery).toHaveBeenCalledWith(
        repository,
        queryOptions,
      );
      expect(result).toEqual(activities);
    });
  });
});
