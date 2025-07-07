import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './database/database.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UserSessionModule } from './user-session/user-session.module';
import { ActivitiesModule } from './activities/activities.module';
import { UserStatisticsModule } from './user-statistics/user-statistics.module';
import { LoggerModule, LoggingInterceptor } from './common/logger';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    LoggerModule,
    UsersModule,
    AuthModule,
    UserSessionModule,
    //ActivitiesModule,
    UserStatisticsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
