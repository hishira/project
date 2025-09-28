import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getUserDtoFromUser, UserDTO } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';
import { User } from '../entities/users/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { UserAuthenticationService } from './services/user-authentication.service';
import { UserPasswordService } from './services/user-password.service';
import { UserRegistrationService } from './services/user-registration.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly authenticationService: UserAuthenticationService,
    private readonly registrationService: UserRegistrationService,
    private readonly passwordService: UserPasswordService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{
    user: Omit<Partial<User>, 'password'>;
    access_token: string;
    refresh_token: string;
  }> {
    return this.registrationService.register(registerDto);
  }

  async login(loginDto: LoginDto): Promise<{
    user: Omit<Partial<UserDTO>, 'password'>;
    access_token: string;
    refresh_token: string;
  }> {
    return this.authenticationService.login(loginDto).then((resp) => ({
      access_token: resp.access_token,
      refresh_token: resp.refresh_token,
      user: getUserDtoFromUser(resp.user),
    }));
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async getMe(userId: string): Promise<Omit<Partial<User>, 'password'>> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { credentials: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.passwordService.changePassword(userId, changePasswordDto);
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authenticationService.refreshToken(refreshTokenDto);
  }

  async logout(userId: string): Promise<{ message: string }> {
    return this.authenticationService.logout(userId);
  }
}
