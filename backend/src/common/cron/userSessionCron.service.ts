import { Cron, CronExpression } from '@nestjs/schedule';
import { UserSessionService } from 'src/user-session/user-session.service';
import { CronService } from './cron.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserSessionCronService extends CronService {
  constructor(private readonly userSessionService: UserSessionService) {
    super();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron(): void {
    this.userSessionService
      .getAllSessions()
      .then((sessions) => {
        console.log(`Found ${sessions.length} user sessions.`);
      })
      .catch((error) => {
        console.error('Error fetching user sessions:', error);
      });
  }
}
