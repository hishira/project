import { UserRole } from 'src/entities/users/user-role.entity';
import { SuperAdminBaseRole } from 'src/roles/super-admin-role';

export class SuperAdminRole extends UserRole {
  constructor() {
    super();
    this.name = 'SuperAdmin';
    this.roleType = new SuperAdminBaseRole();
  }
}
