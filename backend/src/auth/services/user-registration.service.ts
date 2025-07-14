import { ConflictException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoggerService } from '../../common/logger';
import { User } from '../../entities/user.entity';
import { CreateEventPayload } from '../../events/events.service';
import { UserSessionService } from '../../user-session/user-session.service';
import { RegisterDto } from '../dto/register.dto';
import { LocalJwtService } from '../jwt.service';

@Injectable()
export class UserRegistrationService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly userSessionService: UserSessionService,
    private readonly logger: LoggerService,
    private readonly eventEmitter: EventEmitter2,
    private readonly jwt: LocalJwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{
    user: Omit<Partial<User>, 'password'>;
    access_token: string;
    refresh_token: string;
  }> {
    const { login, email, password, firstName, lastName } = registerDto;

    this.logger.logInfo('User registration attempt', {
      module: 'UserRegistrationService',
      action: 'register',
      email,
      login,
    });

    await this.validateUniqueConstraints(email, login);
    const user = await this.createUser(registerDto);
    const tokens = await this.setupUserSession(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  private async validateUniqueConstraints(
    email: string,
    login: string,
  ): Promise<void> {
    const existingEmail = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingEmail) {
      this.logger.logWarn('Registration failed: email already exists', {
        module: 'UserRegistrationService',
        action: 'register',
        email,
        reason: 'email_exists',
      });
      throw new ConflictException('Email address is already in use');
    }

    const existingLogin = await this.usersRepository.findOne({
      where: { login },
    });
    if (existingLogin) {
      this.logger.logWarn('Registration failed: login already exists', {
        module: 'UserRegistrationService',
        action: 'register',
        login,
        reason: 'login_exists',
      });
      throw new ConflictException('Login is already in use');
    }
  }

  private async createUser(registerDto: RegisterDto): Promise<User> {
    const { login, email, password, firstName, lastName } = registerDto;

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = this.usersRepository.create({
      login,
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const savedUser = await this.usersRepository.save(user);

    this.eventEmitter.emit(
      'create',
      new CreateEventPayload('User Created', savedUser.id, savedUser),
    );

    this.logger.logAuth('register', savedUser.id, {
      module: 'UserRegistrationService',
      email: savedUser.email,
      login: savedUser.login,
    });

    return savedUser;
  }

  private async setupUserSession(user: User): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const { accessToken, refreshToken } = this.jwt.prepareTokens(user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.userSessionService.createSession(
      user.login,
      refreshToken,
      expiresAt,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
