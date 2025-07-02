import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum EventType {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}
@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', enum: EventType })
  type: EventType;

  @Column()
  corelatedEntityId?: string;

  @Column({ type: 'json', nullable: true })
  corelatedEntity?: any;
}
