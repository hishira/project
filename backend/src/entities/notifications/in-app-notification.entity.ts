import { ChildEntity } from 'typeorm';
import { Notification } from './notification.entity';

@ChildEntity()
export class InAppNotificaction extends Notification {}
