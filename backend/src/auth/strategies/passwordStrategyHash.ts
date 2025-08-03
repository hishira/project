import * as bcrypt from 'bcrypt';

export interface PasswordStrategyHash {
  createHashedPassword(password: string): Promise<string>;
  validatePassword(password: string, hashedPassword: string): Promise<boolean>;
}
export class UserPasswordStrategyHash implements PasswordStrategyHash {
  private readonly saltRounds = 12;

  createHashedPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
