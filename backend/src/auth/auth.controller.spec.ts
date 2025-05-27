import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserSessionService } from '../user-session/user-session.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userSessionService: UserSessionService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    getMe: jest.fn(),
    changePassword: jest.fn(),
  };

  const mockUserSessionService = {
    createSession: jest.fn(),
    findSessionByUserAndToken: jest.fn(),
    updateSession: jest.fn(),
    deleteAllUserSessions: jest.fn(),
    deleteSession: jest.fn(),
    getUserSessions: jest.fn(),
    getSessionCount: jest.fn(),
    cleanupExpiredSessions: jest.fn(),
  };

  const mockUser = {
    id: '1',
    login: 'johndoe',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthResponse = {
    user: mockUser,
    access_token: 'mock-jwt-token',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UserSessionService,
          useValue: mockUserSessionService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userSessionService = module.get<UserSessionService>(UserSessionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        login: 'johndoe',
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockAuthService.register.mockResolvedValue(mockAuthResponse);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toBe(mockAuthResponse);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto: LoginDto = {
        identifier: 'test@example.com',
        password: 'Password123!',
      };

      mockAuthService.login.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toBe(mockAuthResponse);
    });
  });

  describe('getMe', () => {
    it('should return current user data', async () => {
      const req = {
        user: {
          sub: '1',
          email: 'test@example.com',
        },
      } as any;

      mockAuthService.getMe.mockResolvedValue(mockUser);

      const result = await controller.getMe(req);

      expect(authService.getMe).toHaveBeenCalledWith('1');
      expect(result).toBe(mockUser);
    });
  });

  describe('changePassword', () => {
    it('should change user password', async () => {
      const req = {
        user: {
          sub: '1',
          email: 'test@example.com',
        },
      } as any;

      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
      };

      const mockResponse = { message: 'Password changed successfully' };
      mockAuthService.changePassword.mockResolvedValue(mockResponse);

      const result = await controller.changePassword(req, changePasswordDto);

      expect(authService.changePassword).toHaveBeenCalledWith(
        '1',
        changePasswordDto,
      );
      expect(result).toBe(mockResponse);
    });
  });
});
