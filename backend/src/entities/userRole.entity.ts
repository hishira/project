import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

interface Resource {}

interface Role {
  hasAccess(resource: Resource): boolean;
}

@Entity()
export class UserRole extends BaseEntity implements Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  hasAccess(resource: Resource): boolean {
    return true;
  }
}
