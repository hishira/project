import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CompanyAttributes {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
