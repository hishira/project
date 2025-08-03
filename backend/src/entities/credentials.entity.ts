import {
  AuthenticateProvider,
  IAuthentication,
} from 'src/auth/strategies/authentication';
import { Entity, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Credentials implements IAuthentication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  abstract authenticate(provider: AuthenticateProvider): Promise<boolean>;
}
