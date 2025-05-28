import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserSessionService } from './user-session.service';
import { UserSession } from '../entities/user-session.entity';

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UserSessionService', () => {
  let service: UserSessionService;
  let repository: jest.Mocked<Repository<UserSession>>;

  const mockUserSession = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userLogin: 'testuser',
    refreshToken: 'hashedRefreshToken',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent: 'Mozilla/5.0',
    ipAddress: '192.168.1.1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSessionService,
        {
          provide: getRepositoryToken(UserSession),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            count: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserSessionService>(UserSessionService);
    repository = module.get(getRepositoryToken(UserSession));

    jest.clearAllMocks();
    mockedBcrypt.hash.mockResolvedValue('hashedRefreshToken' as never);
    mockedBcrypt.compare.mockResolvedValue(true as never);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSession', () => {
    it('should create a new session with hashed refresh token', async () => {
      const createResult = {
        ...mockUserSession,
        refreshToken: 'hashedRefreshToken',
      };

      repository.create.mockReturnValue(createResult as UserSession);
      repository.save.mockResolvedValue(createResult as UserSession);

      const result = await service.createSession(
        'testuser',
        'plainRefreshToken',
        new Date(),
        'Mozilla/5.0',
        '192.168.1.1',
      );

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('plainRefreshToken', 10);
      expect(repository.create).toHaveBeenCalledWith({
        userLogin: 'testuser',
        refreshToken: 'hashedRefreshToken',
        expiresAt: expect.any(Date),
        userAgent: 'Mozilla/5.0',
        ipAddress: '192.168.1.1',
      });
      expect(repository.save).toHaveBeenCalledWith(createResult);
      expect(result).toEqual(createResult);
    });
  });

  describe('findValidSession', () => {
    it('should find and validate session with correct refresh token', async () => {
      const sessionWithToken = {
        ...mockUserSession,
        refreshToken: 'hashedRefreshToken',
      };

      repository.find.mockResolvedValue([sessionWithToken as UserSession]);

      const result = await service.findValidSession(
        'testuser',
        'plainRefreshToken',
      );

      expect(repository.find).toHaveBeenCalledWith({
        where: { userLogin: 'testuser' },
        select: [
          'id',
          'userLogin',
          'refreshToken',
          'expiresAt',
          'createdAt',
          'updatedAt',
        ],
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        'plainRefreshToken',
        'hashedRefreshToken',
      );
      expect(result).toEqual(sessionWithToken);
    });

    it('should return null if no sessions found', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findValidSession(
        'testuser',
        'plainRefreshToken',
      );

      expect(result).toBeNull();
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });
  });

  describe('updateSession', () => {
    it('should update session with new hashed refresh token', async () => {
      repository.update.mockResolvedValue({
        affected: 1,
        generatedMaps: [],
        raw: [],
      });

      await service.updateSession(
        '123e4567-e89b-12d3-a456-426614174000',
        'newPlainRefreshToken',
        new Date(),
      );

      expect(mockedBcrypt.hash).toHaveBeenCalledWith(
        'newPlainRefreshToken',
        10,
      );
      expect(repository.update).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        {
          refreshToken: 'hashedRefreshToken',
          expiresAt: expect.any(Date),
        },
      );
    });
  });

  describe('deleteSession', () => {
    it('should delete a specific session', async () => {
      repository.delete.mockResolvedValue({ affected: 1, raw: [] });

      await service.deleteSession('123e4567-e89b-12d3-a456-426614174000');

      expect(repository.delete).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
      );
    });
  });

  describe('deleteUserSessions', () => {
    it('should delete all sessions for a user', async () => {
      repository.delete.mockResolvedValue({ affected: 3, raw: [] });

      await service.deleteUserSessions('testuser');

      expect(repository.delete).toHaveBeenCalledWith({ userLogin: 'testuser' });
    });
  });

  describe('getUserSessions', () => {
    it('should return active sessions for a user', async () => {
      const activeSessions = [mockUserSession, mockUserSession];
      repository.find.mockResolvedValue(activeSessions as UserSession[]);

      const result = await service.getUserSessions('testuser');

      expect(repository.find).toHaveBeenCalledWith({
        where: { userLogin: 'testuser' },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(activeSessions);
    });
  });

  describe('getActiveSessionCount', () => {
    it('should return count of active sessions for a user', async () => {
      repository.count.mockResolvedValue(5);

      const result = await service.getActiveSessionCount('testuser');

      expect(repository.count).toHaveBeenCalledWith({
        where: {
          userLogin: 'testuser',
          expiresAt: expect.any(Object),
        },
      });
      expect(result).toBe(5);
    });
  });

  describe('cleanupExpiredSessions', () => {
    it('should delete expired sessions', async () => {
      repository.delete.mockResolvedValue({ affected: 10, raw: [] });

      await service.cleanupExpiredSessions();

      expect(repository.delete).toHaveBeenCalledWith({
        expiresAt: expect.any(Object),
      });
    });
  });

  describe('getAllActiveSessions', () => {
    it('should return all active sessions', async () => {
      const activeSessions = [mockUserSession, mockUserSession];
      repository.find.mockResolvedValue(activeSessions as UserSession[]);

      const result = await service.getAllActiveSessions();

      expect(repository.find).toHaveBeenCalledWith({
        where: {
          expiresAt: expect.any(Object),
        },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(activeSessions);
    });
  });
});
