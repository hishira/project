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

  abstract validatePassword(password: string): Promise<boolean>;
  abstract createHashedPassword(password: string): Promise<string>;
}

@ChildEntity()
export class UserCredentials extends Credentials {
  private readonly saltRounds = 12;
  passwordStrategyHash: PasswordStrategyHash = new UserPasswordStrategyHash();
  constructor(login: string, email: string, password: string) {
    super();
    this.login = login;
    this.email = email;
    this.password = password;
  }

  override validatePassword(password: string): Promise<boolean> {
    return this.passwordStrategyHash?.validatePassword(password, this.password);
  }

  override createHashedPassword(password: string): Promise<string> {
    return this.passwordStrategyHash?.createHashedPassword(password);
  }
}
