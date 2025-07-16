import { User } from 'src/entities/user.entity';

export const USER_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid username/email or password',
  ACCOUNT_DEACTIVATED: 'Account is deactivated',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  LOGOUT_SUCCESS: 'Logged out successfully',
  EMAIL_IN_USE: 'Email address is already in use',
  LOGIN_IN_USE: 'Login is already in use',
} as const;

export const LOG_METADATA = {
  MODULE: 'UserAuthenticationService',
  ACTIONS: {
    LOGIN: 'login',
    LOGOUT: 'logout',
  },
  MESSAGES: {
    LOGIN_ATTEMPT: 'User login attempt',
    LOGIN_FAILED_USER: 'Login failed: user not found',
    LOGIN_FAILED_INACTIVE: 'Login failed: account deactivated',
    LOGIN_FAILED_PASSWORD: 'Login failed: invalid password',
    LOGOUT_ATTEMPT: 'User logout attempt',
  },
} as const;

export const USER_FIELDS = {
  ID: 'id',
  LOGIN: 'login',
  EMAIL: 'email',
  PASSWORD: 'password',
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  IS_ACTIVE: 'isActive',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export const TOKEN_EXPIRY_DAYS = 7;

export const selection: (keyof User)[] = [
  USER_FIELDS.ID,
  USER_FIELDS.LOGIN,
  USER_FIELDS.EMAIL,
  USER_FIELDS.PASSWORD,
  USER_FIELDS.FIRST_NAME,
  USER_FIELDS.LAST_NAME,
  USER_FIELDS.IS_ACTIVE,
  USER_FIELDS.CREATED_AT,
  USER_FIELDS.UPDATED_AT,
];

export const USER_REGISTRATION_LOG_METADATA = {
  MODULE: 'UserRegistrationService',
  ACTIONS: {
    REGISTER: 'register',
  },
  MESSAGES: {
    REGISTRATION_ATTEMPT: 'User registration attempt',
    REGISTRATION_FAILED_EMAIL: 'Registration failed: email already exists',
    REGISTRATION_FAILED_LOGIN: 'Registration failed: login already exists',
    USER_CREATED: 'User Created',
  },
  REASONS: {
    EMAIL_EXISTS: 'email_exists',
    LOGIN_EXISTS: 'login_exists',
  },
} as const;

export const EVENTS = {
  CREATE: 'create',
} as const;

export const SECURITY = {
  SALT_ROUNDS: 12,
  TOKEN_EXPIRY_DAYS: 7,
} as const;
