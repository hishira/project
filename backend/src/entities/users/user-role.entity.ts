import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import {
  BaseRole,
  Resource,
  Role,
  RoleTransporter,
  RoleType,
} from '../roles/roles.entity';

@Entity()
export class UserRole extends BaseEntity implements Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({
    type: 'varchar',
    enum: RoleType,
    default: RoleType.Unknown,
    unique: true,
    transformer: RoleTransporter,
  })
  roleType: BaseRole;

  hasAccess(_: Resource): boolean {
    return true;
  }
}
