import { UserRole } from 'src/entities/users/user-role.entity';
import { AdminBaseRole } from 'src/roles/admin-role';

export class AdminUserRole extends UserRole {
  constructor() {
    super();
    this.name = 'Admin';
    this.roleType = new AdminBaseRole();
  }
}
