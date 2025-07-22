import { UserType } from 'src/users/userTypes';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityWithAddress } from './bride/entityWithAddress.entity';
import { UserRole } from './userRole.entity';
import { Credentials } from './credentials.entity';
import { State } from './base.entity';

@Entity()
export class User extends EntityWithAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Credentials, (c) => c.user)
  @JoinColumn()
  credentials: Credentials;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ type: 'text', enum: UserType, default: UserType.None })
  userType: UserType;

  @Column({ type: 'text', nullable: true })
  roleId: string;

  @OneToOne(() => UserRole)
  @JoinColumn({ name: 'roleId', referencedColumnName: 'id' })
  role?: Promise<UserRole>;

}
