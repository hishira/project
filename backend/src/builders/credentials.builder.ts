import { Credentials } from 'src/entities/credentials.entity';
import { Builder } from './builder';
import {
  PasswordStrategyHash,
  UserPasswordStrategyHash,
} from 'src/auth/strategies/passwordStrategyHash';
import { UserCredentials } from 'src/entities/user-credentials.entity';

export class CredentialsBuilder implements Builder<Credentials> {
  private readonly creadentials: Credentials;

  build(): Credentials {
    return this.creadentials;
  }
}

export class UserCredentialsBuilder implements Builder<UserCredentials> {
  private readonly credentials: UserCredentials;
  private readonly passwordStrategyHash: PasswordStrategyHash =
    new UserPasswordStrategyHash();

  constructor() {
    this.credentials = new UserCredentials('', '', '');
  }

  build(): UserCredentials {
    return this.credentials;
  }

  setEmail(email: string): this {
    this.credentials.email = email;
    return this;
  }

  setPassword(password: string): this {
    this.credentials.password = password;
    return this;
  }

  setLogin(login: string): this {
    this.credentials.login = login;
    return this;
  }

  async hashPassword(): Promise<this> {
    this.credentials.password =
      await this.passwordStrategyHash.createHashedPassword(
        this.credentials.password,
      );
    return this;
  }
}
