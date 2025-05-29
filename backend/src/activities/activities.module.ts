import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '../entities/activity.entity';
import { UserStatisticsModule } from '../user-statistics/user-statistics.module';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ActivityQueryService } from './services/activity-query.service';
import { ActivityStatisticsService } from './services/activity-statistics.service';
import { CalorieCalculationService } from './services/calorie-calculation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Activity]), UserStatisticsModule],
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
