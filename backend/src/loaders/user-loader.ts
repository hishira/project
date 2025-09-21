import {
  AdminBuilder,
  EmployeeBuilder,
  ManagerBuilder,
  UserBuilder,
} from 'src/catalog/users/user-builder';
import { DataLoader, Loader } from './data-loader';
import { User } from 'src/entities/users/user.entity';

export class UserLoader extends DataLoader implements Loader {
  async load(): Promise<void> {
    await this.initialize();
    const users = await this.prepareUsers();
    Promise.all(
      users.map((user) => this.dataSource.getRepository(User).save(user)),
    )
      .then(() => console.log('Users loaded'))
      .catch((e) => e && console.error(e));
  }

  private async prepareUsers(): Promise<User[]> {
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
    const employeeUser = (
      await new EmployeeBuilder().prepareCredentials(
        'employee@example.com',
        'employee',
        'Password123!',
      )
    )
      .setFirstName('Employee')
      .setLastName('Employee')
      .build();

    const managerUser = (
      await new ManagerBuilder().prepareCredentials(
        'manager@example.com',
        'manager',
        'Password123!',
      )
    )
      .setFirstName('Manager')
      .setLastName('Manager')
      .build();

    return [normalUser, adminUser, employeeUser, managerUser];
  }
}
