import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStatisticsService } from './user-statistics.service';
import { UserStatistics } from '../entities/user-statistics.entity';
import {
  Activity,
  ActivityType,
  DifficultyLevel,
} from '../entities/activity.entity';

describe('UserStatisticsService', () => {
  let service: UserStatisticsService;
  let userStatsRepository: jest.Mocked<Repository<UserStatistics>>;
  let activityRepository: jest.Mocked<Repository<Activity>>;

  const mockUserStats: Partial<UserStatistics> = {
    id: '1',
    userLogin: 'testuser',
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
  };

  const mockRunningActivity: Partial<Activity> = {
    id: 'activity-1',
    type: ActivityType.RUNNING,
    title: 'Morning Run',
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
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSwimmingActivity: Partial<Activity> = {
    id: 'activity-2',
    type: ActivityType.SWIMMING,
    title: 'Pool Swimming',
    duration: 45,
    difficulty: DifficultyLevel.HARD,
    activityDate: new Date('2024-01-16'),
    userLogin: 'testuser',
    metadata: {
      poolSize: 50,
      laps: 40,
      strokeType: 'freestyle',
    },
    caloriesBurned: 400,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUserStatsRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    const mockActivityRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserStatisticsService,
        {
          provide: getRepositoryToken(UserStatistics),
          useValue: mockUserStatsRepo,
        },
        {
          provide: getRepositoryToken(Activity),
          useValue: mockActivityRepo,
        },
      ],
    }).compile();

    service = module.get<UserStatisticsService>(UserStatisticsService);
    userStatsRepository = module.get(getRepositoryToken(UserStatistics));
    activityRepository = module.get(getRepositoryToken(Activity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserStatistics', () => {
    it('should return existing statistics', async () => {
      userStatsRepository.findOne.mockResolvedValue(
        mockUserStats as UserStatistics,
      );

      const result = await service.getUserStatistics('testuser');

      expect(userStatsRepository.findOne).toHaveBeenCalledWith({
        where: { userLogin: 'testuser' },
      });
      expect(result).toEqual(mockUserStats);
    });

    it('should create new statistics if none exist', async () => {
      userStatsRepository.findOne.mockResolvedValue(null);
      userStatsRepository.create.mockReturnValue(
        mockUserStats as UserStatistics,
      );
      userStatsRepository.save.mockResolvedValue(
        mockUserStats as UserStatistics,
      );

      const result = await service.getUserStatistics('testuser');

      expect(userStatsRepository.create).toHaveBeenCalledWith({
        userLogin: 'testuser',
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
      expect(result).toEqual(mockUserStats);
    });
  });

  describe('updateStatisticsForNewActivity', () => {
    it('should update statistics for running activity', async () => {
      const initialStats = JSON.parse(JSON.stringify(mockUserStats)) as UserStatistics;
      userStatsRepository.findOne.mockResolvedValue(initialStats);
      
      userStatsRepository.save.mockImplementation((stats) => {
        return Promise.resolve(stats as UserStatistics);
      });
      
      // Mock empty activities for averages calculation
      activityRepository.find.mockResolvedValue([]);

      const result = await service.updateStatisticsForNewActivity(
        mockRunningActivity as Activity,
      );

      expect(result.totalRunningActivities).toBe(1);
      expect(result.totalRunningDistance).toBe(5);
      expect(result.totalActivities).toBe(1);
      expect(result.totalDuration).toBe(30);
      expect(result.totalCaloriesBurned).toBe(300);
      expect(result.totalDistanceAllActivities).toBe(5);
    });

    it('should update statistics for swimming activity', async () => {
      const initialStats = { ...mockUserStats } as UserStatistics;
      userStatsRepository.findOne.mockResolvedValue(initialStats);
      userStatsRepository.save.mockImplementation((stats) =>
        Promise.resolve(stats as UserStatistics),
      );
      // Mock empty activities for averages calculation
      activityRepository.find.mockResolvedValue([]);

      const result = await service.updateStatisticsForNewActivity(
        mockSwimmingActivity as Activity,
      );

      expect(result.totalSwimmingActivities).toBe(1);
      expect(result.totalSwimmingDistance).toBe(2); // 50m * 40 laps = 2000m = 2km
      expect(result.totalSwimmingLaps).toBe(40);
      expect(result.totalSwimmingDuration).toBe(45);
      expect(result.totalActivities).toBe(1);
      expect(result.totalDuration).toBe(45);
      expect(result.totalCaloriesBurned).toBe(400);
      expect(result.totalDistanceAllActivities).toBe(2);
    });

    it('should update best records for new activity', async () => {
      const initialStats = { ...mockUserStats } as UserStatistics;
      userStatsRepository.findOne.mockResolvedValue(initialStats);
      userStatsRepository.save.mockImplementation((stats) =>
        Promise.resolve(stats as UserStatistics),
      );
      // Mock empty activities for averages calculation
      activityRepository.find.mockResolvedValue([]);

      const result = await service.updateStatisticsForNewActivity(
        mockRunningActivity as Activity,
      );

      expect(result.distanceRecords?.longestRun).toBeDefined();
      expect(result.distanceRecords?.longestRun?.value).toBe(5);
      expect(result.distanceRecords?.longestRun?.unit).toBe('km');
      expect(result.distanceRecords?.longestRun?.activityId).toBe('activity-1');

      expect(result.speedRecords?.fastestRunPace).toBeDefined();
      expect(result.speedRecords?.fastestRunPace?.value).toBe(6);
      expect(result.speedRecords?.fastestRunPace?.unit).toBe('min/km');

      expect(result.generalRecords?.mostCaloriesBurned).toBeDefined();
      expect(result.generalRecords?.mostCaloriesBurned?.value).toBe(300);
      expect(result.generalRecords?.longestDuration?.value).toBe(30);
    });
  });

  describe('recalculateAllStatistics', () => {
    it('should recalculate statistics from all activities', async () => {
      const activities = [
        mockRunningActivity,
        mockSwimmingActivity,
      ] as Activity[];
      const initialStats = { ...mockUserStats } as UserStatistics;

      userStatsRepository.findOne.mockResolvedValue(initialStats);
      activityRepository.find.mockResolvedValue(activities);
      userStatsRepository.save.mockImplementation((stats) =>
        Promise.resolve(stats as UserStatistics),
      );

      const result = await service.recalculateAllStatistics('testuser');

      expect(result.totalActivities).toBe(2);
      expect(result.totalRunningActivities).toBe(1);
      expect(result.totalSwimmingActivities).toBe(1);
      expect(result.totalRunningDistance).toBe(5);
      expect(result.totalSwimmingDistance).toBe(2);
      expect(result.totalDuration).toBe(75); // 30 + 45
      expect(result.totalCaloriesBurned).toBe(700); // 300 + 400
      expect(result.totalDistanceAllActivities).toBe(7); // 5 + 2
    });
  });
});
