import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  street: string;

  @Column({ nullable: false })
  city: string;

  @Column({ nullable: false })
  postalCode: string;

  @Column({ nullable: true })
  houseNumber?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true, default: null })
  lng?: number;

  @Column({ nullable: true, default: null })
  lat?: number;
}
