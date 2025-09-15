import { AdminBuilder, UserBuilder } from 'src/catalog/users/user-builder';
import { DataLoader, Loader } from './data-loader';
import { User } from 'src/entities/users/user.entity';

export class UserLoader extends DataLoader implements Loader {
  async load(): Promise<void> {
    await this.initialize();
    const normalUser = (
      await new UserBuilder().prepareCredentials(
        'user@example.com',
        'user',
        'Password123!',
      )
    )
      .setFirstName('Test')
      .setLastName('Test')
      .build();
    const adminUser = (
      await new AdminBuilder().prepareCredentials(
        'admin@example.com',
        'admin',
        'Password123!',
      )
    )
      .setFirstName('Admin')
      .setLastName('Admin')
      .build();
    const users = [normalUser, adminUser];
    Promise.all(
      users.map((user) => this.dataSource.getRepository(User).save(user)),
    )
      .then(() => console.log('Users loaded'))
      .catch((e) => e && console.error(e));
  }
}
