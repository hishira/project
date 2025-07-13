import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSession } from '../entities/user-session.entity';
import { UserSessionService } from './user-session.service';
import { UserSessionCronService } from 'src/common/cron/userSessionCron.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSession])],
  providers: [UserSessionService, UserSessionCronService],
  exports: [UserSessionService],
})
export class UserSessionModule {}
