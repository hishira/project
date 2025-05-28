export interface LoginDto {
  identifier: string; // email or login
  password: string;
}

export interface RegisterDto {
  login: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface RefreshTokenDto {
  refresh_token: string;
}

export interface AuthResponse {
  user: {
    id: string;
    login: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  access_token: string;
  refresh_token: string;
}

export interface UserSession {
  id: string;
  userLogin: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}
