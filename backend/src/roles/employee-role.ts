import { BaseRole } from './base-role';
import { Resource, RoleType } from './roles';

export class EmployeeBaseRole extends BaseRole {
  roleType: RoleType = RoleType.Employee;
  hasAccess(resource: Resource): boolean {
    return true;
  }
}
