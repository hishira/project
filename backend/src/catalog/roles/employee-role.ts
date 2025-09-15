import { UserRole } from 'src/entities/users/user-role.entity';
import { EmployeeBaseRole } from 'src/roles/employee-role';

export class EmployeeRole extends UserRole {
  constructor() {
    super();
    this.id = '9effde56-fb76-49c1-827c-a721a3f59d09';
    this.name = 'Employee';
    this.roleType = new EmployeeBaseRole();
  }
}
