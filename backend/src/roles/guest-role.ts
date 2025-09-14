import { BaseRole } from './base-role';
import { Resource, RoleType } from './roles';

export class GuestBaseRole extends BaseRole {
  roleType: RoleType = RoleType.Guest;
  hasAccess(resource: Resource): boolean {
    return false;
  }
}
