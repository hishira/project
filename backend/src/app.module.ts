import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { databaseConfig } from './database/database.config';
import { UserSessionModule } from './user-session/user-session.module';
import { UsersModule } from './users/users.module';
//import { ActivitiesModule } from './activities/activities.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule, LoggingInterceptor } from './common/logger';
import { Event } from './entities/event.entity';
import { EventsService } from './events/events.service';
import { UserStatisticsModule } from './user-statistics/user-statistics.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Event]),
    LoggerModule,
    UsersModule,
    AuthModule,
    UserSessionModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    UserStatisticsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EventsService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
