import { ConflictException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Credentials, UserCredentials } from 'src/entities/credentials.entity';
import { Repository } from 'typeorm';
import { LoggerService } from '../../common/logger';
import { User } from '../../entities/user.entity';
import { CreateEventPayload } from '../../events/events.service';
import { UserSessionService } from '../../user-session/user-session.service';
import { RegisterDto } from '../dto/register.dto';
import { LocalJwtService } from '../jwt.service';
import {
  EVENTS,
  SECURITY,
  USER_FIELDS,
  USER_MESSAGES,
  USER_REGISTRATION_LOG_METADATA,
} from './constst';

@Injectable()
export class UserRegistrationService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Credentials)
    private readonly credentialsRepository: Repository<Credentials>,
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
    const { login, email } = registerDto;

    this.logger.logInfo(
      USER_REGISTRATION_LOG_METADATA.MESSAGES.REGISTRATION_ATTEMPT,
      {
        module: USER_REGISTRATION_LOG_METADATA.MODULE,
        action: USER_REGISTRATION_LOG_METADATA.ACTIONS.REGISTER,
        email,
        login,
      },
    );

    await this.validateUniqueConstraints(email, login);
    const user = await this.createUser(registerDto);
    const tokens = await this.setupUserSession(user);

    // Remove password from response
    const { ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  private async validateUniqueConstraints(
    email: string,
    login: string,
  ): Promise<void> {
    const existingEmail = await this.credentialsRepository.findOne({
      where: { [USER_FIELDS.EMAIL]: email },
    });
    if (existingEmail) {
      this.logger.logWarn(
        USER_REGISTRATION_LOG_METADATA.MESSAGES.REGISTRATION_FAILED_EMAIL,
        {
          module: USER_REGISTRATION_LOG_METADATA.MODULE,
          action: USER_REGISTRATION_LOG_METADATA.ACTIONS.REGISTER,
          email,
          reason: USER_REGISTRATION_LOG_METADATA.REASONS.EMAIL_EXISTS,
        },
      );
      throw new ConflictException(USER_MESSAGES.EMAIL_IN_USE);
    }

    const existingLogin = await this.credentialsRepository.findOne({
      where: { [USER_FIELDS.LOGIN]: login },
    });
    if (existingLogin) {
      this.logger.logWarn(
        USER_REGISTRATION_LOG_METADATA.MESSAGES.REGISTRATION_FAILED_LOGIN,
        {
          module: USER_REGISTRATION_LOG_METADATA.MODULE,
          action: USER_REGISTRATION_LOG_METADATA.ACTIONS.REGISTER,
          login,
          reason: USER_REGISTRATION_LOG_METADATA.REASONS.LOGIN_EXISTS,
        },
      );
      throw new ConflictException(USER_MESSAGES.LOGIN_IN_USE);
    }
  }

  private async createUser(registerDto: RegisterDto): Promise<User> {
    const { login, email, password, firstName, lastName } = registerDto;

    const credentials: UserCredentials = await UserCredentials.Create(
      login,
      email,
      password,
    );
    const user = this.usersRepository.create({
      credentials,
      firstName,
      lastName,
    });

    user.credentials = credentials;

    const savedUser = await this.usersRepository.save(user);

    this.eventEmitter.emit(
      EVENTS.CREATE,
      new CreateEventPayload(
        USER_REGISTRATION_LOG_METADATA.MESSAGES.USER_CREATED,
        savedUser.id,
        savedUser,
      ),
    );

    this.logger.logAuth(
      USER_REGISTRATION_LOG_METADATA.ACTIONS.REGISTER,
      savedUser.id,
      {
        module: USER_REGISTRATION_LOG_METADATA.MODULE,
        email: credentials.email,
        login: credentials.login,
      },
    );

    return savedUser;
  }

  private async setupUserSession(user: User): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const { accessToken, refreshToken } = this.jwt.prepareTokens(user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SECURITY.TOKEN_EXPIRY_DAYS);

    await this.userSessionService.createSession(
      user.credentials?.login ?? 'Unknown user login',
      refreshToken,
      expiresAt,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
