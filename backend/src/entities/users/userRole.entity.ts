import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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

  hasAccess(_: Resource): boolean {
    return true;
  }
}
