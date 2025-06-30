import {
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as BEntity,
} from 'typeorm';

export class BaseEntity extends BEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
