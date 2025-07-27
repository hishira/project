import { UserType } from 'src/users/userTypes';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityWithAddress } from './bride/entityWithAddress.entity';
import { UserCredentials } from './credentials.entity';
import { UserRole } from './userRole.entity';

@Entity()
export class User extends EntityWithAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserCredentials, { cascade: true })
  @JoinColumn({ name: 'credentialsId', referencedColumnName: 'id' })
  credentials: UserCredentials;

  @Column()
  credentialsId: string;

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
