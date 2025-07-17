import { Column, JoinColumn, OneToOne } from 'typeorm';
import { Address } from '../address.entity';
import { BaseEntity } from '../base.entity';

export class EntityWithAddress extends BaseEntity {
  @Column({ type: 'text', nullable: true, select: false })
  addressId: string;

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn({ name: 'addressId', referencedColumnName: 'id' })
  address: Promise<Address>;
}
