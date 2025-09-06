import { UserAuthenticateProvider } from 'src/auth/strategies/authentication';
import {
  PasswordStrategyHash,
  UserPasswordStrategyHash,
} from 'src/auth/strategies/passwordStrategyHash';
import { ChildEntity, Column } from 'typeorm';
import { Credentials } from '../credentials.entity';

@ChildEntity()
export class UserCredentials extends Credentials {
  @Column({ unique: true })
  login: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: true }) // Don't include password in queries by default
  password: string;

  readonly passwordStrategyHash: PasswordStrategyHash =
    new UserPasswordStrategyHash();

  constructor(login: string, email: string, password: string) {
    super();
    this.login = login;
    this.email = email;
    this.password = password;
  }

  override async authenticate(
    provider: UserAuthenticateProvider,
  ): Promise<boolean> {
    return this.validatePassword(provider.password);
  }

  private validatePassword(password: string): Promise<boolean> {
    return this.passwordStrategyHash.validatePassword(password, this.password);
  }
}
