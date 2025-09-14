import { BaseRole } from './base-role';
import { Resource, RoleType } from './roles';

export class AdminBaseRole extends BaseRole {
  roleType: RoleType = RoleType.Admin;
  hasAccess(resource: Resource): boolean {
    return true;
  }
}
