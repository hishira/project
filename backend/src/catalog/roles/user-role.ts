import { UserRole } from 'src/entities/users/user-role.entity';
import { UserBaseRole } from 'src/roles/user-role';

export class NormalUserRole extends UserRole {
  constructor() {
    super();
    this.id = '20e0c016-37d6-462c-b729-9f342cb5e5dd';
    this.name = 'User';
    this.roleType = new UserBaseRole();
  }
}
