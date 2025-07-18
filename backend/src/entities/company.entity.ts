import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { EntityWithAddress } from './bride/entityWithAddress.entity';
import { User } from './user.entity';

@Entity()
export class Company extends EntityWithAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: false })
  ownerId: string;

  @OneToMany(() => User)
  @JoinColumn({ name: 'ownerId', referencedColumnName: 'id' })
  users: Promise<User[]>;
}
