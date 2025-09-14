import { BaseRole } from './base-role';
import { Resource, RoleType } from './roles';

export class UnknownBaseRole extends BaseRole {
  roleType: RoleType = RoleType.Unknown;
  hasAccess(resource: Resource): boolean {
    return false;
  }
}
