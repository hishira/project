import { UserRole } from 'src/entities/users/user-role.entity';
import { UserBaseRole } from 'src/roles/user-role';

export class NormalUserRole extends UserRole {
  constructor() {
    super();
    this.name = 'User';
    this.roleType = new UserBaseRole();
  }
}
