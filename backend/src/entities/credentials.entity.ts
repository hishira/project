import * as bcrypt from 'bcrypt';
import {
  ChildEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';

interface PasswordStrategyHash {
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

// TODO change logic
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Credentials {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  login: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Don't include password in queries by default
  password: string;
}

@ChildEntity()
export class UserCredentials extends Credentials {
  private readonly saltRounds = 12;
  static readonly passwordStrategyHash: PasswordStrategyHash =
    new UserPasswordStrategyHash();

  static async Create(
    login: string,
    email: string,
    password: string,
  ): Promise<UserCredentials> {
    const hashedPassword = await this.createHashedPassword(password);
    return new this(login, email, hashedPassword);
  }

  constructor(login: string, email: string, password: string) {
    super();
    this.login = login;
    this.email = email;
    this.password = password;
  }

  async updatePassowrd(password: string): Promise<void> {
    this.password = await UserCredentials.createHashedPassword(password);
  }
  validatePassword(password: string): Promise<boolean> {
    return UserCredentials._validatePassword(password, this.password);
  }
  private static _validatePassword(
    password: string,
    currentPassword: string,
  ): Promise<boolean> {
    return this.passwordStrategyHash?.validatePassword(
      password,
      currentPassword,
    );
  }

  private static createHashedPassword(password: string): Promise<string> {
    return this.passwordStrategyHash?.createHashedPassword(password);
  }
}
