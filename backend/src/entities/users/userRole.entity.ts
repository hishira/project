import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Resource {}

interface Role {
  hasAccess(resource: Resource): boolean;
}

export enum RoleType {
  User = 'user',
  Admin = 'admin',
  SuperAdmin = 'superadmin',
  Employee = 'employee',
  Manager = 'manager',
  Guest = 'guest',
  Unknown = 'unknown',
}

@Entity()
export class UserRole extends BaseEntity implements Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'varchar', enum: RoleType, default: RoleType.Unknown })
  roleType: RoleType;

  hasAccess(_: Resource): boolean {
    return true;
  }
}
