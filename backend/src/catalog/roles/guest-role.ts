import { UserRole } from 'src/entities/users/user-role.entity';
import { GuestBaseRole } from 'src/roles/guest-role';

export class GuestRole extends UserRole {
  constructor() {
    super();
    this.id = '39f766f7-5098-4294-810d-c848e3de898c';
    this.name = 'Guest';
    this.roleType = new GuestBaseRole();
  }
}
