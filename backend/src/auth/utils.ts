import { User } from 'src/entities/user.entity';

export class JwtPayload {
  readonly sub: string;
  readonly email: string;
  readonly login: string;
  readonly iat?: number;
  readonly exp?: number;

  static fromUser(user: User): JwtPayload {
    const payload = new JwtPayload();
    payload.sub = user.id;
    payload.email = user.email;
    payload.login = user.login;
    return payload;
  }
}
