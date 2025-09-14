import { UserRole } from 'src/entities/users/user-role.entity';
import { ManagerBaseRole } from 'src/roles/manager-role';

export class ManagerRole extends UserRole {
  constructor() {
    super();
    this.name = 'Manager';
    this.roleType = new ManagerBaseRole();
  }
}
