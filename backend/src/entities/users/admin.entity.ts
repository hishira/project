import { ChildEntity, OneToMany } from 'typeorm';
import { User } from './user.entity';

@ChildEntity()
export class Admin extends User {
  @OneToMany(() => User, (user) => user.owner)
  subordinates?: Promise<User[]>;
}
