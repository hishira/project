import { UserType } from 'src/users/userTypes';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityWithAddress } from './bride/entityWithAddress.entity';
import { Credentials } from './credentials.entity';
import { UserRole } from './userRole.entity';

@Entity()
export class User extends EntityWithAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Credentials, (c) => c.user, { cascade: true })
  @JoinColumn({ name: 'credentialsId', referencedColumnName: 'id' })
  credentials: Credentials;

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
