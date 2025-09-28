import { AuthResponse } from '../../shared/models/auth.model';

export const adminUserMock = {
    createdAt: '2025-09-06T23:23:03.000Z',
    updatedAt: '2025-09-06T23:23:03.000Z',
    state: {
      state: {
        state: 'active',
      },
    },
    addressId: null,
    id: 'c8cecfcf-bf57-4370-aaf9-c603875694c5',
    credentials: {
      id: '0cb31dbb-dae7-4841-a7df-0aff5f82b730',
      login: 'admin',
      email: 'admin@example.com',
      password: '$2b$12$bKV8iMYG3gBlFFxBowTN5.vlmPLYN0glmQsjUUDI/XrdKVy4ee14O',
      passwordStrategyHash: {
        saltRounds: 12,
      },
    },
    credentialsId: '0cb31dbb-dae7-4841-a7df-0aff5f82b730',
    firstName: null,
    ownerId: null,
    lastName: null,
    userType: 'Admin',
    roleId: null,
    role: {
      roleType: { roleType: 'admin' },
    },
  };

export const authResponseMock = {
  user: adminUserMock,
  access_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGNlY2ZjZi1iZjU3LTQzNzAtYWFmOS1jNjAzODc1Njk0YzUiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwibG9naW4iOiJhZG1pbiIsImlhdCI6MTc1NzIwMDk4MywiZXhwIjoxNzU3Mjg3MzgzfQ.JGFj4L7junwNDtt12imyaoJANVpFkz_rMYDqY27fW2M',
  refresh_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGNlY2ZjZi1iZjU3LTQzNzAtYWFmOS1jNjAzODc1Njk0YzUiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwibG9naW4iOiJhZG1pbiIsImlhdCI6MTc1NzIwMDk4MywiZXhwIjoxNzU3ODA1NzgzfQ.CKC5FAQl2MWVRm5mf2tOFbcHg2mHYAb9YFz7Orcc6ys',
} as any as AuthResponse;
