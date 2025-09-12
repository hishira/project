import { UserType } from 'src/users/userTypes';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { EntityWithAddress } from '../bride/entityWithAddress.entity';
import { UserCredentials } from './user-credentials.entity';
import { UserRole } from './user-role.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User extends EntityWithAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserCredentials, { cascade: true })
  @JoinColumn({ name: 'credentialsId', referencedColumnName: 'id' })
  credentials: UserCredentials;

  @Column({ select: false })
  credentialsId: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  ownerId?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ type: 'text', enum: UserType, default: UserType.None })
  userType: UserType;

  @Column({ type: 'text', nullable: true })
  roleId: string;

  @OneToOne(() => UserRole)
  @JoinColumn({ name: 'roleId', referencedColumnName: 'id' })
  role?: Promise<UserRole>;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'ownerId', referencedColumnName: 'id' })
  owner?: Promise<User>;
}
