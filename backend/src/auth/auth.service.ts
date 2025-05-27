import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{
    user: Omit<User, 'password' | 'refreshToken'>;
    access_token: string;
    refresh_token: string;
  }> {
    const { login, email, password, firstName, lastName } = registerDto;

    // Check if email already exists
    const existingEmail = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException('Email address is already in use');
    }

    // Check if login already exists
    const existingLogin = await this.usersRepository.findOne({
      where: { login },
    });
    if (existingLogin) {
      throw new ConflictException('Login is already in use');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = this.usersRepository.create({
      login,
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const savedUser = await this.usersRepository.save(user);

    // Generate JWT tokens
    const payload: JwtPayload = {
      sub: savedUser.id,
      email: savedUser.email,
      login: savedUser.login,
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Hash and store refresh token
    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    await this.usersRepository.update(savedUser.id, {
      refreshToken: hashedRefreshToken,
    });

    // Remove password and refresh token from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, refreshToken: __, ...userWithoutPassword } = savedUser;

    return {
      user: userWithoutPassword,
      access_token,
      refresh_token,
    };
  }

  async login(loginDto: LoginDto): Promise<{
    user: Omit<User, 'password' | 'refreshToken'>;
    access_token: string;
    refresh_token: string;
  }> {
    const { identifier, password } = loginDto;

    // Check if identifier is email or login
    let user: User | null = null;

    // Try to find by email
    if (identifier.includes('@')) {
      user = await this.usersRepository.findOne({
        where: { email: identifier },
        select: [
          'id',
          'login',
          'email',
          'password',
          'firstName',
          'lastName',
          'isActive',
          'createdAt',
          'updatedAt',
        ],
      });
    }

    // If not found, try to find by login
    if (!user) {
      user = await this.usersRepository.findOne({
        where: { login: identifier },
        select: [
          'id',
          'login',
          'email',
          'password',
          'firstName',
          'lastName',
          'isActive',
          'createdAt',
          'updatedAt',
        ],
      });
    }

    if (!user) {
      throw new UnauthorizedException('Invalid username/email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username/email or password');
    }

    // Generate JWT tokens
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      login: user.login,
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Hash and store refresh token
    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    await this.usersRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    // Remove password and refresh token from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, refreshToken: __, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      access_token,
      refresh_token,
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async getMe(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    // Get user with password for verification (same approach as login)
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'login',
        'email',
        'password',
        'firstName',
        'lastName',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.usersRepository.update(userId, { password: hashedNewPassword });

    return { message: 'Password changed successfully' };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { refresh_token } = refreshTokenDto;

    try {
      // Verify the refresh token
      const decoded = this.jwtService.verify(refresh_token);
      const payload = decoded as JwtPayload;

      // Find user with refresh token
      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
        select: ['id', 'login', 'email', 'refreshToken', 'isActive'],
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }

      // Verify refresh token against stored hash
      const isRefreshTokenValid = await bcrypt.compare(
        refresh_token,
        user.refreshToken,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        login: user.login,
      };

      const access_token = this.jwtService.sign(newPayload);
      const new_refresh_token = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      // Hash and store new refresh token
      const hashedRefreshToken = await bcrypt.hash(new_refresh_token, 10);
      await this.usersRepository.update(user.id, {
        refreshToken: hashedRefreshToken,
      });

      return {
        access_token,
        refresh_token: new_refresh_token,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<{ message: string }> {
    // Clear refresh token from database
    await this.usersRepository.update(userId, { refreshToken: undefined });
    return { message: 'Logged out successfully' };
  }
}
