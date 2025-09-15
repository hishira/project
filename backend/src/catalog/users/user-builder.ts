import { Builder } from 'src/builders/builder';
import { UserCredentialsBuilder } from 'src/builders/credentials.builder';
import { User } from 'src/entities/users/user.entity';
import { NormalUserRole } from '../roles/user-role';
import { AdminUserRole } from '../roles/admin-user-role';

export class UserBuilder implements Builder<User> {
  user: User = new User();
  constructor() {
    this.user.role = new NormalUserRole();
  }
  async prepareCredentials(
    email: string,
    login: string,
    password: string,
  ): Promise<this> {
    this.user.credentials = (
      await new UserCredentialsBuilder()
        .setEmail(email)
        .setLogin(login)
        .setPassword(password)
        .hashPassword()
    ).build();
    return this;
  }

  setFirstName(value: string): this {
    this.user.firstName = value;
    return this;
  }

  setLastName(value: string): this {
    this.user.lastName = value;
    return this;
  }

  build(): User {
    return this.user;
  }
}

export class AdminBuilder extends UserBuilder {
  constructor() {
    super();
    this.user.role = new AdminUserRole();
  }
}
