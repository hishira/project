import { UserRole } from 'src/entities/users/user-role.entity';
import { SuperAdminBaseRole } from 'src/roles/super-admin-role';

export class SuperAdminRole extends UserRole {
  constructor() {
    super();
    this.id = 'e92a03da-22fa-4717-b99f-1c84395d417e';
    this.name = 'SuperAdmin';
    this.roleType = new SuperAdminBaseRole();
  }
}
