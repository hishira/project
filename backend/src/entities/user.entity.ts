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

@Entity()
export class User extends EntityWithAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Credentials, { cascade: true })
  @JoinColumn()
  credentials: Credentials;
  // @Column({ unique: true })
  // login: string;

  // @Column({ unique: true })
  // email: string;

  // @Column({ select: false }) // Don't include password in queries by default
  // password: string;

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
