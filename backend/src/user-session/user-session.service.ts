import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserSession } from '../entities/user-session.entity';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) {}

  /**
   * Create a new session for a user
   */
  async createSession(
    userLogin: string,
    refreshToken: string,
    expiresAt: Date,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<UserSession> {
    // Hash the refresh token before storing
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    const session = this.userSessionRepository.create({
      userLogin,
      refreshToken: hashedRefreshToken,
      expiresAt,
      userAgent,
      ipAddress,
    });

    return this.userSessionRepository.save(session);
  }

  /**
   * Find a session by user login and verify refresh token
   */
  async findValidSession(
    userLogin: string,
    refreshToken: string,
  ): Promise<UserSession | null> {
    const sessions = await this.userSessionRepository.find({
      where: { userLogin },
      select: [
        'id',
        'userLogin',
        'refreshToken',
        'expiresAt',
        'createdAt',
        'updatedAt',
      ],
    });

    // Check each session to find a matching refresh token
    for (const session of sessions) {
      try {
        const isValid = await bcrypt.compare(
          refreshToken,
          session.refreshToken,
        );
        if (isValid && session.expiresAt > new Date()) {
          return session;
        }
      } catch {
        // Continue to next session if comparison fails
        continue;
      }
    }

    return null;
  }

  /**
   * Update a session's refresh token
   */
  async updateSession(
    sessionId: string,
    newRefreshToken: string,
    newExpiresAt: Date,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

    await this.userSessionRepository.update(sessionId, {
      refreshToken: hashedRefreshToken,
      expiresAt: newExpiresAt,
    });
  }

  /**
   * Delete a specific session
   */
  async deleteSession(sessionId: string): Promise<void> {
    await this.userSessionRepository.delete(sessionId);
  }

  /**
   * Delete all sessions for a user
   */
  async deleteUserSessions(userLogin: string): Promise<void> {
    await this.userSessionRepository.delete({ userLogin });
  }

  /**
   * Get all active sessions for a user
   */
  async getUserSessions(
    userLogin: string,
  ): Promise<Omit<UserSession, 'refreshToken'>[]> {
    return this.userSessionRepository.find({
      where: { userLogin },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<void> {
    const now = new Date();
    const result = await this.userSessionRepository.delete({
      expiresAt: LessThan(now),
    });

    if (result.affected && result.affected > 0) {
      console.log(`Cleaned up ${result.affected} expired sessions`);
    }
  }

  /**
   * Get count of active sessions for a user
   */
  async getActiveSessionCount(userLogin: string): Promise<number> {
    return this.userSessionRepository.count({
      where: {
        userLogin,
        expiresAt: MoreThan(new Date()),
      },
    });
  }

  /**
   * Get all active sessions across all users (admin functionality)
   */
  async getAllActiveSessions(): Promise<Omit<UserSession, 'refreshToken'>[]> {
    return this.userSessionRepository.find({
      where: {
        expiresAt: MoreThan(new Date()),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getAllSessions(): Promise<UserSession[]> {
    return this.userSessionRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
