import { UserRole } from 'src/entities/users/user-role.entity';
import { EmployeeBaseRole } from 'src/roles/employee-role';

export class EmployeeRole extends UserRole {
  constructor() {
    super();
    this.name = 'Employee';
    this.roleType = new EmployeeBaseRole();
  }
}
