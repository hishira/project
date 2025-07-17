import { User } from 'src/entities/user.entity';

export class JwtPayload {
  readonly sub: string;
  readonly email: string;
  readonly login: string;
  readonly iat?: number;
  readonly exp?: number;

  private constructor(user: User) {
    this.sub = user.id;
    this.email = user.email;
    this.login = user.login;
  }
  static fromUser(user: User): JwtPayload {
    const payload = new JwtPayload(user);
    return payload;
  }
}
