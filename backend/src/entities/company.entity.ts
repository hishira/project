import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
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

  @OneToOne(() => User)
  @JoinColumn({ name: 'ownerId', referencedColumnName: 'id' })
  user: Promise<User>;
}
