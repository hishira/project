import {
  BaseEntity as BEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum State {
  Active = 'active',
  Inactive = 'inactive',
  Suspended = 'suspended',
  Deleted = 'deleted',
  Unknown = 'unknown',
}
export abstract class BaseEntity extends BEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', enum: State, default: State.Active })
  state: State;
}
