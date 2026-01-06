// import { UserType, RoleType, State, AddressDTO } from './types'; // assuming types are exported from './types'
export enum UserType {
  User = 'user',
  Admin = 'admin',
  SuperAdmin = 'superadmin',
  Guest = 'guest',
  Moderator = 'moderator',
  Support = 'support',
  None = 'none',
  System = 'system',
  Bot = 'bot',
  Developer = 'developer',
  Unknowk = 'unknown',
}
export type AddressDTO = {
  street: string;
  city: string;
  postalCode: string;
  houseNumber: string;
  country: string;
  lng?: number;
  lat?: number;
};
export enum RoleType {
  User = 'User',
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin',
  Employee = 'Employee',
  Manager = 'Manager',
  Guest = 'Guest',
  Unknown = 'Unknown',
}
export enum State {
  Active = 'active',
  Inactive = 'inactive',
  Suspended = 'suspended',
  Deleted = 'deleted',
  Unknown = 'unknown',
}
export const usersListMocks: {
  id: string;
  credentials: { login: string; email: string };
  firstName: string;
  lastName: string;
  userType: UserType;
  role: RoleType;
  address: AddressDTO;
  createdAt: string;
  updatedAt: string;
  state: State;
}[] = [
  {
    id: 'usr_01a2b3c4d5e6f7g8h9i0j',
    credentials: {
      login: 'jdoe123',
      email: 'john.doe@example.com',
    },
    firstName: 'John',
    lastName: 'Doe',
    userType: UserType.User,
    role: RoleType.User,
    address: {
      street: 'Maple Avenue',
      city: 'Springfield',
      postalCode: '62704',
      houseNumber: '123',
      country: 'USA',
      lng: -89.6501,
      lat: 39.8017,
    },
    createdAt: '2023-01-15T08:30:00Z',
    updatedAt: '2024-03-10T14:22:10Z',
    state: State.Active,
  },
  {
    id: 'usr_02k3l4m5n6o7p8q9r0s1t',
    credentials: {
      login: 'asmith',
      email: 'alice.smith@company.com',
    },
    firstName: 'Alice',
    lastName: 'Smith',
    userType: UserType.Admin,
    role: RoleType.Admin,
    address: {
      street: 'Oak Street',
      city: 'Metropolis',
      postalCode: '10001',
      houseNumber: '45B',
      country: 'USA',
      lng: -73.9857,
      lat: 40.7484,
    },
    createdAt: '2022-11-05T10:15:30Z',
    updatedAt: '2024-02-28T09:45:22Z',
    state: State.Active,
  },
  {
    id: 'usr_03u4v5w6x7y8z9a0b1c2d',
    credentials: {
      login: 'superuser',
      email: 'root@system.org',
    },
    firstName: 'System',
    lastName: 'Root',
    userType: UserType.SuperAdmin,
    role: RoleType.SuperAdmin,
    address: {
      street: 'Server Lane',
      city: 'Datacenter City',
      postalCode: '90210',
      houseNumber: '1',
      country: 'USA',
      lng: -118.4065,
      lat: 34.0901,
    },
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2024-04-01T12:00:00Z',
    state: State.Active,
  },
  {
    id: 'usr_04e5f6g7h8i9j0k1l2m3n',
    credentials: {
      login: 'guest_visitor',
      email: 'guest123@tempmail.com',
    },
    firstName: 'Guest',
    lastName: 'User',
    userType: UserType.Guest,
    role: RoleType.Guest,
    address: {
      street: 'Temporary Road',
      city: 'Nowhere',
      postalCode: '00000',
      houseNumber: '0',
      country: 'Unknown',
      lng: 0,
      lat: 0,
    },
    createdAt: '2024-04-05T16:20:00Z',
    updatedAt: '2024-04-05T16:20:00Z',
    state: State.Inactive,
  },
  {
    id: 'usr_05o6p7q8r9s0t1u2v3w4x',
    credentials: {
      login: 'mod_sarah',
      email: 'sarah.moderator@forum.net',
    },
    firstName: 'Sarah',
    lastName: 'Johnson',
    userType: UserType.Moderator,
    role: RoleType.Manager,
    address: {
      street: 'Forum Square',
      city: 'Communityville',
      postalCode: '54321',
      houseNumber: '789',
      country: 'Canada',
      lng: -79.3832,
      lat: 43.6532,
    },
    createdAt: '2023-07-12T11:30:45Z',
    updatedAt: '2024-03-22T18:10:05Z',
    state: State.Active,
  },
  {
    id: 'usr_06y7z8a9b0c1d2e3f4g5h',
    credentials: {
      login: 'support_tom',
      email: 'tom.support@helpdesk.com',
    },
    firstName: 'Tom',
    lastName: 'Wilson',
    userType: UserType.Support,
    role: RoleType.Employee,
    address: {
      street: 'Help Street',
      city: 'Assistance City',
      postalCode: '11223',
      houseNumber: '55',
      country: 'UK',
      lng: -0.1278,
      lat: 51.5074,
    },
    createdAt: '2023-09-30T09:00:00Z',
    updatedAt: '2024-01-15T13:45:30Z',
    state: State.Active,
  },
  {
    id: 'usr_07i8j9k0l1m2n3o4p5q6r',
    credentials: {
      login: 'bot_assistant',
      email: 'assistant@ai.bot',
    },
    firstName: 'AI',
    lastName: 'Assistant',
    userType: UserType.Bot,
    role: RoleType.Unknown,
    address: {
      street: 'Digital Highway',
      city: 'Cyber City',
      postalCode: '10101',
      houseNumber: 'AI-01',
      country: 'Internet',
      lng: 0,
      lat: 0,
    },
    createdAt: '2024-02-14T00:00:00Z',
    updatedAt: '2024-04-02T07:30:15Z',
    state: State.Active,
  },
  {
    id: 'usr_08s9t0u1v2w3x4y5z6a7b',
    credentials: {
      login: 'dev_mike',
      email: 'mike.developer@tech.io',
    },
    firstName: 'Mike',
    lastName: 'Chen',
    userType: UserType.Developer,
    role: RoleType.Employee,
    address: {
      street: 'Code Boulevard',
      city: 'Silicon Valley',
      postalCode: '94043',
      houseNumber: '101',
      country: 'USA',
      lng: -122.0841,
      lat: 37.422,
    },
    createdAt: '2022-05-20T14:25:10Z',
    updatedAt: '2024-03-18T16:55:40Z',
    state: State.Active,
  },
  {
    id: 'usr_09c0d1e2f3g4h5i6j7k8l',
    credentials: {
      login: 'suspended_user',
      email: 'banned.user@example.com',
    },
    firstName: 'Robert',
    lastName: 'Black',
    userType: UserType.User,
    role: RoleType.User,
    address: {
      street: 'Shadow Lane',
      city: 'Penalty Town',
      postalCode: '99999',
      houseNumber: '666',
      country: 'Nowhere',
      lng: null as any, // Optional fields can be omitted or set to undefined
      lat: null as any,
    },
    createdAt: '2023-03-10T12:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    state: State.Suspended,
  },
  {
    id: 'usr_10m1n2o3p4q5r6s7t8u9v',
    credentials: {
      login: 'deleted_account',
      email: 'former.user@oldmail.com',
    },
    firstName: 'Jane',
    lastName: 'Doe',
    userType: UserType.None,
    role: RoleType.Unknown,
    address: {
      street: '',
      city: '',
      postalCode: '',
      houseNumber: '',
      country: '',
      lng: undefined,
      lat: undefined,
    },
    createdAt: '2021-12-01T10:10:10Z',
    updatedAt: '2023-11-30T23:59:59Z',
    state: State.Deleted,
  },
];

export type UserMock = {
  id: string;
  credentials: UserMockCredentials;
  firstName: string;
  lastName: string;
  userType: UserType;
  role: RoleType;
  address: AddressDTO;
  createdAt: string;
  updatedAt: string;
  state: State;
}
export type UserMockCredentials = {
  login: string;
  email: string;
};
export const userMock: UserMock = {
  id: 'usr_01a2b3c4d5e6f7g8h9i0j',
  credentials: {
    login: 'jdoe123',
    email: 'john.doe@example.com',
  },
  firstName: 'John',
  lastName: 'Doe',
  userType: UserType.User,
  role: RoleType.User,
  address: {
    street: 'Maple Avenue',
    city: 'Springfield',
    postalCode: '62704',
    houseNumber: '123',
    country: 'USA',
    lng: -89.6501,
    lat: 39.8017,
  },
  createdAt: '2023-01-15T08:30:00Z',
  updatedAt: '2024-03-10T14:22:10Z',
  state: State.Active,
};
