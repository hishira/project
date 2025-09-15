import { UserRole } from 'src/entities/users/user-role.entity';
import { UnknownBaseRole } from 'src/roles/unknown-role';

export class UnknownRole extends UserRole {
  constructor() {
    super();
    this.id = '9fc62a71-ff1e-432b-8a92-c70b2f88ad2b';
    this.name = 'Unknown';
    this.roleType = new UnknownBaseRole();
  }
}
