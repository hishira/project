import { DataLoader, Loader } from './data-loader';
import { UserRole } from '../entities/users/user-role.entity';
import 'reflect-metadata';
import { AdminUserRole } from 'src/catalog/roles/admin-user-role';
import { BaseRole } from 'src/catalog/roles/base-role';
import { EmployeeRole } from 'src/catalog/roles/employee-role';
import { GuestRole } from 'src/catalog/roles/guest-role';
import { ManagerRole } from 'src/catalog/roles/manager-role';
import { SuperAdminRole } from 'src/catalog/roles/super-admin-role';
import { UnknownRole } from 'src/catalog/roles/unknown-role';
import { NormalUserRole } from 'src/catalog/roles/user-role';

export class RoleLoader extends DataLoader implements Loader {
  readonly roles: UserRole[] = [
    new AdminUserRole(),
    new BaseRole(),
    new EmployeeRole(),
    new GuestRole(),
    new ManagerRole(),
    new SuperAdminRole(),
    new UnknownRole(),
    new NormalUserRole(),
  ];
  async load(): Promise<void> {
    await this.initialize();
    Promise.all(
      this.roles.map((role) =>
        this.dataSource.getRepository(UserRole).save(role),
      ),
    )
      .then(() => console.log('Roles loaded'))
      .catch((e) => e && console.error(e));
  }
}
