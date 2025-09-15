import { UserRole } from 'src/entities/users/user-role.entity';
import { AdminBaseRole } from 'src/roles/admin-role';

export class AdminUserRole extends UserRole {
  constructor() {
    super();
    this.id = 'cb66cad6-739f-4d90-884e-bd340abb551c';
    this.name = 'Admin';
    this.roleType = new AdminBaseRole();
  }
}
