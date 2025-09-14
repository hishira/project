import { UserRole } from 'src/entities/users/user-role.entity';
import { GuestBaseRole } from 'src/roles/guest-role';

export class GuestRole extends UserRole {
  constructor() {
    super();
    this.name = 'Guest';
    this.roleType = new GuestBaseRole();
  }
}
