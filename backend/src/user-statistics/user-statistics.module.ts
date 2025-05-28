import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStatisticsService } from './user-statistics.service';
import { UserStatisticsController } from './user-statistics.controller';
import { UserStatistics } from '../entities/user-statistics.entity';
import { Activity } from '../entities/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserStatistics, Activity])],
  controllers: [UserStatisticsController],
  providers: [UserStatisticsService],
  exports: [UserStatisticsService],
})
export class UserStatisticsModule {}
