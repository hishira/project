import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../entities/users/user.entity';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserSessionService } from '../user-session/user-session.service';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let userSessionService: UserSessionService;

  const mockUser: User = {
    id: '1',
    login: 'johndoe',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockUserSessionService = {
    createSession: jest.fn(),
    findValidSession: jest.fn(),
    updateSession: jest.fn(),
    deleteUserSessions: jest.fn(),
    deleteSession: jest.fn(),
    getUserSessions: jest.fn(),
    getSessionCount: jest.fn(),
    cleanupExpiredSessions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UserSessionService,
          useValue: mockUserSessionService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    userSessionService = module.get<UserSessionService>(UserSessionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      login: 'janesmith',
      email: 'new@example.com',
      password: 'Password123!',
      firstName: 'Jane',
      lastName: 'Smith',
    };

    it('should successfully register a new user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-token');

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('mock-token');
      expect(result.user).not.toHaveProperty('password');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should successfully register a new user without firstName and lastName', async () => {
      const registerDtoMinimal: RegisterDto = {
        login: 'janesmith',
        email: 'new@example.com',
        password: 'Password123!',
      };

      const mockUserMinimal = {
        ...mockUser,
        firstName: undefined,
        lastName: undefined,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUserMinimal);
      mockUserRepository.save.mockResolvedValue(mockUserMinimal);
      mockJwtService.sign.mockReturnValue('mock-token');

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      const result = await service.register(registerDtoMinimal);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('mock-token');
      expect(result.user).not.toHaveProperty('password');
      expect(result.user.firstName).toBeUndefined();
      expect(result.user.lastName).toBeUndefined();
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      identifier: 'test@example.com',
      password: 'Password123!',
    };

    it('should successfully login with valid credentials', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-token');

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('mock-token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      mockUserRepository.findOne.mockResolvedValue(inactiveUser);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('changePassword', () => {
    const changePasswordDto: ChangePasswordDto = {
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword123!',
    };

    it('should successfully change password with valid current password', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValue('newHashedPassword' as never);
      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.changePassword('1', changePasswordDto);

      expect(result).toEqual({ message: 'Password changed successfully' });
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', {
        password: 'newHashedPassword',
      });
    });

    it('should throw UnauthorizedException for invalid current password', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        service.changePassword('1', changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.changePassword('1', changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getMe', () => {
    it('should return user data without password', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getMe('1');

      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe('1');
      expect(result.email).toBe('test@example.com');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getMe('1')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return user if found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('1');

      expect(result).toBe(mockUser);
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.validateUser('1');

      expect(result).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh token with valid refresh token', async () => {
      const refreshTokenDto = { refresh_token: 'valid_refresh_token' };
      const mockPayload = {
        sub: '1',
        email: 'test@test.com',
        login: 'testuser',
      };
      const mockUserWithoutRefreshToken = {
        id: '1',
        login: 'testuser',
        email: 'test@test.com',
        isActive: true,
      };
      const mockSession = {
        id: 'session-id',
        userLogin: 'testuser',
        refreshToken: 'hashedRefreshToken',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUserRepository.findOne.mockResolvedValue(mockUserWithoutRefreshToken);
      mockUserSessionService.findValidSession.mockResolvedValue(mockSession);
      mockJwtService.sign.mockReturnValue('new_access_token');
      mockUserSessionService.updateSession.mockResolvedValue(undefined);

      const result = await service.refreshToken(refreshTokenDto);

      expect(result).toEqual({
        access_token: 'new_access_token',
        refresh_token: 'new_access_token',
      });
      expect(mockJwtService.verify).toHaveBeenCalledWith('valid_refresh_token');
      expect(mockUserSessionService.findValidSession).toHaveBeenCalledWith(
        'testuser',
        'valid_refresh_token',
      );
      expect(mockUserSessionService.updateSession).toHaveBeenCalledWith(
        'session-id',
        'new_access_token',
        expect.any(Date),
      );
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      const refreshTokenDto = { refresh_token: 'invalid_refresh_token' };

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const refreshTokenDto = { refresh_token: 'valid_refresh_token' };
      const mockPayload = {
        sub: '1',
        email: 'test@test.com',
        login: 'testuser',
      };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('should throw UnauthorizedException if refresh token does not match', async () => {
      const refreshTokenDto = { refresh_token: 'valid_refresh_token' };
      const mockPayload = {
        sub: '1',
        email: 'test@test.com',
        login: 'testuser',
      };
      const mockUser = {
        id: '1',
        login: 'testuser',
        email: 'test@test.com',
        isActive: true,
      };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserSessionService.findValidSession.mockResolvedValue(null); // No valid session found

      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow(
        'Invalid refresh token',
      );
    });
  });

  describe('logout', () => {
    it('should successfully logout user', async () => {
      const mockUser = {
        id: '1',
        login: 'testuser',
        email: 'test@test.com',
        isActive: true,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserSessionService.deleteUserSessions.mockResolvedValue(undefined);

      const result = await service.logout('1');

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        select: ['login'],
      });
      expect(mockUserSessionService.deleteUserSessions).toHaveBeenCalledWith(
        'testuser',
      );
    });
  });
});
