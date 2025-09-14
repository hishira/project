import { UserRole } from 'src/entities/users/user-role.entity';
import { UnknownBaseRole } from 'src/roles/unknown-role';

export class UnknownRole extends UserRole {
  constructor() {
    super();
    this.name = 'Unknown';
    this.roleType = new UnknownBaseRole();
  }
}
