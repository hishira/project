import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '../../common/logger';
import { User } from '../../entities/users/user.entity';
import { UserSessionService } from '../../user-session/user-session.service';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { LocalJwtService } from '../jwt.service';
import { JwtPayload } from '../utils';
import {
  LOG_METADATA,
  TOKEN_EXPIRY_DAYS,
  USER_FIELDS,
  USER_MESSAGES,
} from './constst';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class UserAuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly userSessionService: UserSessionService,
    private readonly logger: LoggerService,
    private readonly jwt: LocalJwtService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async login(loginDto: LoginDto): Promise<{
    user: Omit<Partial<User>, 'password'>;
    access_token: string;
    refresh_token: string;
  }> {
    const { identifier, password } = loginDto;

    this.logger.logInfo(LOG_METADATA.MESSAGES.LOGIN_ATTEMPT, {
      module: LOG_METADATA.MODULE,
      action: LOG_METADATA.ACTIONS.LOGIN,
      identifier,
    });

    const user = await this.findUserByIdentifier(identifier);

    if (!user) {
      this.logger.logWarn(LOG_METADATA.MESSAGES.LOGIN_FAILED_USER, {
        module: LOG_METADATA.MODULE,
        action: LOG_METADATA.ACTIONS.LOGIN,
        identifier,
      });
      throw new UnauthorizedException(USER_MESSAGES.INVALID_CREDENTIALS);
    }

    this.validateUserStatus(user, identifier);
    await this.authenticationService.authenticate(user.credentials, {
      password,
    });
    const { accessToken: access_token, refreshToken: refresh_token } =
      this.jwt.prepareTokens(user);

    await this.createUserSession(user, refresh_token);

    // Remove password from response
    const { ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      access_token,
      refresh_token,
    };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { refresh_token } = refreshTokenDto;

    try {
      const { user, session } = await this.validateRefreshToken(refresh_token);
      const { accessToken: access_token, refreshToken: new_refresh_token } =
        this.jwt.prepareTokens(user);

      await this.updateUserSession(session.id, new_refresh_token);

      return {
        access_token,
        refresh_token: new_refresh_token,
      };
    } catch {
      throw new UnauthorizedException(USER_MESSAGES.INVALID_REFRESH_TOKEN);
    }
  }

  async logout(userId: string): Promise<{ message: string }> {
    this.logger.logInfo(LOG_METADATA.MESSAGES.LOGOUT_ATTEMPT, {
      module: LOG_METADATA.MODULE,
      action: LOG_METADATA.ACTIONS.LOGOUT,
      userId,
    });

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: {
        credentials: true,
      },
    });

    if (user) {
      await this.userSessionService.deleteUserSessions(user.credentials?.login);
      this.logger.logAuth(LOG_METADATA.ACTIONS.LOGOUT, userId, {
        module: LOG_METADATA.MODULE,
        login: user.credentials?.login,
      });
    }

    return { message: USER_MESSAGES.LOGOUT_SUCCESS };
  }

  private async findUserByIdentifier(identifier: string): Promise<User | null> {
    if (identifier.includes('@')) {
      return this.usersRepository.findOne({
        relations: {
          credentials: true,
          role: true,
        },
        where: { credentials: { email: identifier } },
      });
    }
    return this.usersRepository.findOne({
      relations: {
        credentials: true,
        role: true,
      },
      where: { credentials: { login: identifier } },
    });
  }

  private validateUserStatus(user: User, identifier: string): void {
    if (!user.state || user.state.isInactive()) {
      this.logger.log(
        `Unactive user wants to login: ${user.credentials?.email},${user.state?.state}`,
      );
      this.logger.logWarn(LOG_METADATA.MESSAGES.LOGIN_FAILED_INACTIVE, {
        module: LOG_METADATA.MODULE,
        action: LOG_METADATA.ACTIONS.LOGIN,
        userId: user.id,
        userState: user.state,
        identifier,
      });
      throw new UnauthorizedException(USER_MESSAGES.ACCOUNT_DEACTIVATED);
    }
  }

  private async validatePassword(password: string, user: User): Promise<void> {
    if (!(await user?.credentials?.authenticate({ password }))) {
      this.logger.logWarn(LOG_METADATA.MESSAGES.LOGIN_FAILED_PASSWORD, {
        module: LOG_METADATA.MODULE,
        action: LOG_METADATA.ACTIONS.LOGIN,
        userId: user.id,
      });
      throw new UnauthorizedException(USER_MESSAGES.INVALID_CREDENTIALS);
    }
  }

  private async createUserSession(
    user: User,
    refreshToken: string,
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + TOKEN_EXPIRY_DAYS);

    await this.userSessionService.createSession(
      user.credentials.login,
      refreshToken,
      expiresAt,
    );

    this.logger.logAuth(LOG_METADATA.ACTIONS.LOGIN, user.id, {
      module: LOG_METADATA.MODULE,
      email: user.credentials.email,
      login: user.credentials.login,
    });
  }

  private async validateRefreshToken(refreshToken: string) {
    const payload: JwtPayload = this.jwt.verify(refreshToken);

    const user = await this.usersRepository.findOne({
      where: { [USER_FIELDS.ID]: payload.sub },
      relations: {
        credentials: true,
      },
      select: [USER_FIELDS.ID],
    });

    if (!user) {
      throw new UnauthorizedException(USER_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    if (user.state.isInactive()) {
      throw new UnauthorizedException(USER_MESSAGES.ACCOUNT_DEACTIVATED);
    }

    const session = await this.userSessionService.findValidSession(
      user.credentials.login,
      refreshToken,
    );

    if (!session) {
      throw new UnauthorizedException(USER_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    return { user, session };
  }

  private async updateUserSession(
    sessionId: string,
    refreshToken: string,
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + TOKEN_EXPIRY_DAYS);

    await this.userSessionService.updateSession(
      sessionId,
      refreshToken,
      expiresAt,
    );
  }
}
