import { Resource, Role, RoleType } from "./roles";

export abstract class BaseRole implements Role {
  abstract roleType: RoleType;
  hasAccess(resource: Resource): boolean {
    return true;
  }
}