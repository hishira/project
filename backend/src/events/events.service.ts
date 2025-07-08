import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from 'src/common/logger';
import { Event, EventType } from 'src/entities/event.entity';
import { Repository } from 'typeorm';

export class CreateEventPayload {
  constructor(
    readonly name: string,
    readonly corelatedEntityId: string,
    readonly corelatedEntity: any,
  ) {}
}
@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly logger: LoggerService,
  ) {
    // Initialization logic if needed
  }
  @OnEvent('create', { async: true })
  handleCreateEvent(payload: CreateEventPayload) {
    const event = this.eventRepository.create({
      name: payload.name,
      corelatedEntityId: payload.corelatedEntityId,
      corelatedEntity: payload.corelatedEntity as unknown,
      type: EventType.Create,
    });

    event
      .save()
      .then(() => {
        this.logger.logDatabase('Event saved successfully', 'event', {
          module: 'UsersService',
          action: 'create',
          eventId: event.id,
          userId: payload.corelatedEntityId,
        });
      })
      .catch((error: Error) => {
        this.logger.logError('Failed to save event', error, {
          module: 'UsersService',
          action: 'create',
          error: error.message,
          userId: payload.corelatedEntityId,
        });
      });
  }
}
