export interface User {
  id: string;
  credentials: any;
  credentialsId: string;
  firstName?: string;
  lastName?: string;
  userType: any;
  roleId: any;
  role?: any;
}

export interface CreateUserDto {
  login: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface UserProfile extends Omit<User, 'password'> {
  // Additional profile data can be added here
}
