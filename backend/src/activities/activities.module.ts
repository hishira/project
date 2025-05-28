import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { Activity } from '../entities/activity.entity';
import { CalorieCalculationService } from './services/calorie-calculation.service';
import { ActivityQueryService } from './services/activity-query.service';
import { ActivityStatisticsService } from './services/activity-statistics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  controllers: [ActivitiesController],
  providers: [
    ActivitiesService,
    CalorieCalculationService,
    ActivityQueryService,
    ActivityStatisticsService,
  ],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
