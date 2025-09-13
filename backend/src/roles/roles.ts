import { ValueTransformer } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Resource {}

export interface Role {
  hasAccess(resource: Resource): boolean;
}

export abstract class BaseRole implements Role {
  abstract roleType: RoleType;
  hasAccess(resource: Resource): boolean {
    return true;
  }
}

export class UserBaseRole extends BaseRole {
  roleType: RoleType = RoleType.User;
  hasAccess(resource: Resource): boolean {
    return true;
  }
}
export class AdminBaseRole extends BaseRole {
  roleType: RoleType = RoleType.Admin;
  hasAccess(resource: Resource): boolean {
    return true;
  }
}
export class SuperAdminBaseRole extends BaseRole {
  roleType: RoleType = RoleType.SuperAdmin;
  hasAccess(resource: Resource): boolean {
    return true;
  }
}
export class EmployeeBaseRole extends BaseRole {
  roleType: RoleType = RoleType.Employee;
  hasAccess(resource: Resource): boolean {
    return true;
  }
}
export class ManagerBaseRole extends BaseRole {
  roleType: RoleType = RoleType.Manager;
  hasAccess(resource: Resource): boolean {
    return true;
  }
}
export class GuestBaseRole extends BaseRole {
  roleType: RoleType = RoleType.Guest;
  hasAccess(resource: Resource): boolean {
    return false;
  }
}
export class UnknownBaseRole extends BaseRole {
  roleType: RoleType = RoleType.Unknown;
  hasAccess(resource: Resource): boolean {
    return false;
  }
}
export enum RoleType {
  User = 'user',
  Admin = 'admin',
  SuperAdmin = 'superadmin',
  Employee = 'employee',
  Manager = 'manager',
  Guest = 'guest',
  Unknown = 'unknown',
}
export const RoleTypeToClass: Record<`${RoleType}`, BaseRole> = {
  [RoleType.User]: new UserBaseRole(),
  [RoleType.Admin]: new AdminBaseRole(),
  [RoleType.SuperAdmin]: new SuperAdminBaseRole(),
  [RoleType.Employee]: new EmployeeBaseRole(),
  [RoleType.Manager]: new ManagerBaseRole(),
  [RoleType.Guest]: new GuestBaseRole(),
  [RoleType.Unknown]: new UnknownBaseRole(),
};

export const RoleTransporter: ValueTransformer = {
  from(value: RoleType): BaseRole {
    return RoleTypeToClass[value];
  },
  to(value: BaseRole | RoleType): RoleType {
    if (value instanceof BaseRole) {
      return value.roleType;
    }
    return value;
  },
};
