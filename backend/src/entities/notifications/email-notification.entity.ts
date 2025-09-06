import { ChildEntity, Column } from 'typeorm';
import { Notification } from './notification.entity';

@ChildEntity()
export class EmailNotification extends Notification {
  @Column({ type: 'varchar' })
  recipientEmail: string;

  @Column({ type: 'text' })
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'boolean', default: false })
  isSent: boolean;
}
