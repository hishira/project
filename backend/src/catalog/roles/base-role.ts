import { UserRole } from 'src/entities/users/user-role.entity';

export class BaseRole extends UserRole {
  constructor() {
    super();
    this.id = '171bc07d-1dce-46b8-9717-bd563f918edd';
    this.name = 'Base';
  }
}
