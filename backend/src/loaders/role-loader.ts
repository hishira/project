import { AdminBaseRole } from '../roles/roles';
import { DataLoader, Loader } from './data-loader';
import { UserRole } from '../entities/users/user-role.entity';
import 'reflect-metadata';
export class AdminUserRole extends UserRole {
  constructor() {
    super();
    this.name = 'Admin';
    this.roleType = new AdminBaseRole();
  }
}
export class RoleLoader extends DataLoader implements Loader {
  readonly admin: UserRole = new AdminUserRole();
  readonly roleRepo = this.dataSource.getRepository(UserRole);
  async load(): Promise<void> {
    await this.dataSource
      .initialize()
      .then((d) => d.getRepository(UserRole).save(this.admin))
      .then(() => {});
  }
}
