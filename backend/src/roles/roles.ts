import { ValueTransformer } from 'typeorm';
import { AdminBaseRole } from './admin-role';
import { BaseRole } from './base-role';
import { EmployeeBaseRole } from './employee-role';
import { GuestBaseRole } from './guest-role';
import { ManagerBaseRole } from './manager-role';
import { SuperAdminBaseRole } from './super-admin-role';
import { UnknownBaseRole } from './unknown-role';
import { UserBaseRole } from './user-role';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Resource {}

export interface Role {
  hasAccess(resource: Resource): boolean;
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
