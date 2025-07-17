import {
  BaseEntity as BEntity,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

export abstract class BaseEntity extends BEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
