import { BaseRole } from './base-role';
import { Resource, RoleType } from './roles';

export class ManagerBaseRole extends BaseRole {
  roleType: RoleType = RoleType.Manager;
  hasAccess(resource: Resource): boolean {
    return true;
  }
}
