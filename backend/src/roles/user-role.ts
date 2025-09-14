import { BaseRole } from './base-role';
import { Resource, RoleType } from './roles';

export class UserBaseRole extends BaseRole {
  roleType: RoleType = RoleType.User;
  hasAccess(resource: Resource): boolean {
    return true;
  }
}
