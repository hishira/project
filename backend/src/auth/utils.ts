import { User } from 'src/entities/users/user.entity';

export abstract class Parser {
  parseToObject(): object {
    return JSON.parse(JSON.stringify(this as any)) as object;
  }
}

export class JwtPayload extends Parser {
  readonly sub: string;
  readonly email: string;
  readonly login: string;
  readonly iat?: number;
  readonly exp?: number;

  private constructor(user: User) {
    super();
    this.sub = user.id;
    this.email = user?.credentials.email;
    this.login = user?.credentials.login;
  }
  static fromUser(user: User): JwtPayload {
    const payload = new JwtPayload(user);
    return payload;
  }
}
