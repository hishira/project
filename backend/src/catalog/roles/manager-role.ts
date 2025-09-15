import { UserRole } from 'src/entities/users/user-role.entity';
import { ManagerBaseRole } from 'src/roles/manager-role';

export class ManagerRole extends UserRole {
  constructor() {
    super();
    this.id = 'dedd5c88-8717-4cbc-b349-05ddbdc2f254';
    this.name = 'Manager';
    this.roleType = new ManagerBaseRole();
  }
}
