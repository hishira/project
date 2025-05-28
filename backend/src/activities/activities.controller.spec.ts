import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ActivityType, DifficultyLevel } from '../entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

describe('ActivitiesController', () => {
  let controller: ActivitiesController;
  let service: jest.Mocked<ActivitiesService>;

  const mockActivity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    type: ActivityType.RUNNING,
    title: 'Morning Run',
    description: 'A nice morning run',
    duration: 30,
    difficulty: DifficultyLevel.MODERATE,
    activityDate: new Date('2024-01-15'),
    userLogin: 'testuser',
    metadata: { location: 'outdoor', distance: 5 },
    caloriesBurned: 300,
    notes: 'Felt great!',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = { login: 'testuser', userId: 'user-123' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [
        {
          provide: ActivitiesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            getStatistics: jest.fn(),
            getRecentActivities: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
    service = module.get(ActivitiesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      service.create.mockResolvedValue(mockActivity as any);

      const result = await controller.create({ user: mockUser }, createActivityDto);

      expect(service.create).toHaveBeenCalledWith('testuser', createActivityDto);
      expect(result).toEqual(mockActivity);
    });
  });

  describe('findAll', () => {
    it('should return all activities for user', async () => {
      const expectedResult = { activities: [mockActivity], total: 1 };
      service.findAll.mockResolvedValue(expectedResult as any);

      const result = await controller.findAll({ user: mockUser });

      expect(service.findAll).toHaveBeenCalledWith('testuser', {
        type: undefined,
        difficulty: undefined,
        dateFrom: undefined,
        dateTo: undefined,
        limit: undefined,
        offset: undefined,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should apply filters when provided', async () => {
      const expectedResult = { activities: [mockActivity], total: 1 };
      service.findAll.mockResolvedValue(expectedResult as any);

      const result = await controller.findAll(
        { user: mockUser },
        ActivityType.RUNNING,
        DifficultyLevel.MODERATE,
        '2024-01-01',
        '2024-01-31',
        10,
        0,
      );

      expect(service.findAll).toHaveBeenCalledWith('testuser', {
        type: ActivityType.RUNNING,
        difficulty: DifficultyLevel.MODERATE,
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
        limit: 10,
        offset: 0,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getRecentActivities', () => {
    it('should return recent activities', async () => {
      const activities = [mockActivity];
      service.getRecentActivities.mockResolvedValue(activities as any);

      const result = await controller.getRecentActivities({ user: mockUser }, 5);

      expect(service.getRecentActivities).toHaveBeenCalledWith('testuser', 5);
      expect(result).toEqual(activities);
    });
  });

  describe('getStatistics', () => {
    it('should return activity statistics', async () => {
      const stats = {
        totalActivities: 10,
        totalDuration: 300,
        averageDifficulty: 3.2,
        activitiesByType: {
          [ActivityType.RUNNING]: 5,
          [ActivityType.SWIMMING]: 5,
          [ActivityType.CYCLING]: 0,
          [ActivityType.SKATING]: 0,
          [ActivityType.HORSE_RIDING]: 0,
          [ActivityType.WALKING]: 0,
          [ActivityType.HIKING]: 0,
          [ActivityType.GYM_WORKOUT]: 0,
          [ActivityType.YOGA]: 0,
          [ActivityType.TENNIS]: 0,
          [ActivityType.FOOTBALL]: 0,
          [ActivityType.BASKETBALL]: 0,
          [ActivityType.OTHER]: 0,
        },
        activitiesByDifficulty: {
          [DifficultyLevel.VERY_EASY]: 0,
          [DifficultyLevel.EASY]: 0,
          [DifficultyLevel.MODERATE]: 10,
          [DifficultyLevel.HARD]: 0,
          [DifficultyLevel.VERY_HARD]: 0,
        },
        totalCaloriesBurned: 2500,
      };
      service.getStatistics.mockResolvedValue(stats);

      const result = await controller.getStatistics(
        { user: mockUser },
        '2024-01-01',
        '2024-01-31',
      );

      expect(service.getStatistics).toHaveBeenCalledWith('testuser', {
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      });
      expect(result).toEqual(stats);
    });
  });

  describe('findOne', () => {
    it('should return a specific activity', async () => {
      service.findOne.mockResolvedValue(mockActivity as any);

      const result = await controller.findOne(
        { user: mockUser },
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(service.findOne).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        'testuser',
      );
      expect(result).toEqual(mockActivity);
    });
  });

  describe('update', () => {
    it('should update an activity', async () => {
      const updateActivityDto: UpdateActivityDto = {
        title: 'Updated Run',
        duration: 45,
      };
      const updatedActivity = { ...mockActivity, ...updateActivityDto };
      service.update.mockResolvedValue(updatedActivity as any);

      const result = await controller.update(
        { user: mockUser },
        '123e4567-e89b-12d3-a456-426614174000',
        updateActivityDto,
      );

      expect(service.update).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        'testuser',
        updateActivityDto,
      );
      expect(result).toEqual(updatedActivity);
    });
  });

  describe('remove', () => {
    it('should remove an activity', async () => {
      service.remove.mockResolvedValue(undefined);

      const result = await controller.remove(
        { user: mockUser },
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(service.remove).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        'testuser',
      );
      expect(result).toBeUndefined();
    });
  });
});
