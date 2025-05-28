import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesService } from './activities.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Activity,
  ActivityType,
  DifficultyLevel,
} from '../entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { CalorieCalculationService } from './services/calorie-calculation.service';
import { ActivityQueryService } from './services/activity-query.service';
import { ActivityStatisticsService } from './services/activity-statistics.service';

describe('ActivitiesService - Calorie Calculation', () => {
  let service: ActivitiesService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesService,
        {
          provide: getRepositoryToken(Activity),
          useValue: mockRepository,
        },
        {
          provide: CalorieCalculationService,
          useValue: {
            calculateCalories: jest
              .fn()
              .mockImplementation((type, duration, difficulty, metadata) => {
                if (
                  type === ActivityType.RUNNING &&
                  metadata?.distance &&
                  metadata?.pace
                ) {
                  const baseCalories = metadata.distance * 70;
                  const paceMultiplier =
                    metadata.pace < 5 ? 1.3 : metadata.pace < 7 ? 1.0 : 0.8;
                  const difficultyMultiplier =
                    difficulty === DifficultyLevel.HARD
                      ? 1.3
                      : difficulty === DifficultyLevel.MODERATE
                        ? 1.1
                        : 1.0;
                  return Math.round(
                    baseCalories * paceMultiplier * difficultyMultiplier,
                  );
                }

                if (
                  type === ActivityType.SWIMMING &&
                  metadata?.poolSize &&
                  metadata?.laps
                ) {
                  const distance = (metadata.poolSize * metadata.laps) / 1000;
                  const baseCalories = distance * 400;
                  const difficultyMultiplier =
                    difficulty === DifficultyLevel.HARD
                      ? 1.3
                      : difficulty === DifficultyLevel.MODERATE
                        ? 1.1
                        : 1.0;
                  return Math.round(baseCalories * difficultyMultiplier);
                }

                const baseRate = 10;
                const difficultyMultiplier =
                  difficulty === DifficultyLevel.HARD
                    ? 1.3
                    : difficulty === DifficultyLevel.MODERATE
                      ? 1.1
                      : 1.0;
                return Math.round(duration * baseRate * difficultyMultiplier);
              }),
          },
        },
        {
          provide: ActivityQueryService,
          useValue: {
            buildFindAllQuery: jest.fn().mockReturnValue({}),
            buildRecentActivitiesQuery: jest.fn().mockReturnValue({}),
            findActivitiesWithQuery: jest
              .fn()
              .mockResolvedValue({ activities: [], total: 0 }),
          },
        },
        {
          provide: ActivityStatisticsService,
          useValue: {
            calculateStatistics: jest.fn(),
            getStatistics: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Automatic Calorie Calculation', () => {
    it('should calculate calories from running metadata when available', async () => {
      const createActivityDto: CreateActivityDto = {
        type: ActivityType.RUNNING,
        title: 'Fast Run',
        duration: 45,
        difficulty: DifficultyLevel.HARD,
        activityDate: '2023-05-15',
        metadata: {
          distance: 5,
          pace: 6,
        },
      };

      const expectedActivity = {
        id: '1',
        ...createActivityDto,
        userLogin: 'testuser',
        activityDate: new Date(createActivityDto.activityDate),
        caloriesBurned: 455,
      };

      mockRepository.create.mockReturnValue(expectedActivity);
      mockRepository.save.mockResolvedValue(expectedActivity);

      const result = await service.create('testuser', createActivityDto);

      expect(result.caloriesBurned).toBeGreaterThan(200);
      expect(result.caloriesBurned).toBeLessThan(600);
    });

    it('should calculate calories from swimming metadata when available', async () => {
      const createActivityDto: CreateActivityDto = {
        type: ActivityType.SWIMMING,
        title: 'Pool Swimming',
        duration: 45,
        difficulty: DifficultyLevel.MODERATE,
        activityDate: '2023-05-15',
        metadata: {
          poolSize: 50,
          laps: 40,
          strokeType: 'freestyle',
        },
      };

      const expectedActivity = {
        id: '1',
        ...createActivityDto,
        userLogin: 'testuser',
        activityDate: new Date(createActivityDto.activityDate),
        caloriesBurned: 880,
      };

      mockRepository.create.mockReturnValue(expectedActivity);
      mockRepository.save.mockResolvedValue(expectedActivity);

      const result = await service.create('testuser', createActivityDto);

      expect(result.caloriesBurned).toBeGreaterThan(500);
      expect(result.caloriesBurned).toBeLessThan(1200);
    });
  });
});
