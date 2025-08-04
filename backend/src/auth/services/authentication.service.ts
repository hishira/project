import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoggerService } from 'src/common/logger';
import {
  AuthenticateProvider,
  IAuthentication,
} from '../strategies/authentication';
import { LOG_METADATA, USER_MESSAGES } from './constst';

@Injectable()
export class AuthenticationService {
  @Inject(LoggerService)
  private readonly logger: LoggerService;

  async authenticate(
    authenticator: IAuthentication,
    authenticateProvider: AuthenticateProvider,
  ): Promise<boolean> {
    if (!(await authenticator?.authenticate(authenticateProvider))) {
      this.logger.logWarn(LOG_METADATA.MESSAGES.LOGIN_FAILED_PASSWORD, {
        module: LOG_METADATA.MODULE,
        action: LOG_METADATA.ACTIONS.LOGIN,
      });
      throw new UnauthorizedException(USER_MESSAGES.INVALID_CREDENTIALS);
    }
    return Promise.resolve(true);
  }
}
