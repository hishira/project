import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesService } from './activities.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Activity } from '../entities/activity.entity';
import { CalorieCalculationService } from './services/calorie-calculation.service';
import { ActivityQueryService } from './services/activity-query.service';
import { ActivityStatisticsService } from './services/activity-statistics.service';

describe('ActivitiesService', () => {
  let service: ActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
            buildQuery: jest.fn().mockReturnValue({}),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
