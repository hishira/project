import { BaseRole } from './base-role';
import { Resource, RoleType } from './roles';

export class SuperAdminBaseRole extends BaseRole {
  roleType: RoleType = RoleType.SuperAdmin;
  hasAccess(resource: Resource): boolean {
    return true;
  }
}
