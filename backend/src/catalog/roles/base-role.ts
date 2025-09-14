import { UserRole } from 'src/entities/users/user-role.entity';

export class BaseRole extends UserRole {
  constructor() {
    super();
    this.name = 'Base';
  }
}
