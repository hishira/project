import * as bcrypt from 'bcrypt';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
@Entity()
@Index(['userLogin']) // Index for faster lookups by user login
@Index(['expiresAt']) // Index for cleanup operations
export class UserSession extends BaseEntity {
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

  async hashToken(): Promise<void> {
    this.refreshToken = await bcrypt.hash(this.refreshToken, 10);
  }

  async isValidToken(token: string): Promise<boolean> {
    return bcrypt.compare(token, this.refreshToken);
  }

  static async hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
  }
}
