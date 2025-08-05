import { Entity, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
