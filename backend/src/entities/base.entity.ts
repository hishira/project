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

export class StateClass {
  constructor(readonly state: State) {}

  isActive(): boolean {
    return this.state === State.Active;
  }
  isInactive(): boolean {
    return this.state !== State.Active;
  }
}
export abstract class BaseEntity extends BEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'varchar',
    enum: State,
    default: State.Active,
    transformer: {
      from(value: State): StateClass {
        return new StateClass(value);
      },
      to(value: StateClass | State): State {
        if (value instanceof StateClass) {
          return value.state;
        }
        return value;
      },
    },
  })
  state: StateClass;
}
