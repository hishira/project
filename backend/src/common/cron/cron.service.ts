import { Inject } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

export abstract class CronService {
  @Inject(SchedulerRegistry)
  protected scheduleRegistry: SchedulerRegistry;
}
