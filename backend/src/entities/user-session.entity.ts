import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity()
@Index(['userLogin']) // Index for faster lookups by user login
@Index(['expiresAt']) // Index for cleanup operations
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userLogin: string;

  @Column({ select: false }) // Don't include refresh token in queries by default
  refreshToken: string;

  @Column()
  expiresAt: Date;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
