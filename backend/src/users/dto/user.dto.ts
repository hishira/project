import { User } from 'src/entities/users/user.entity';
import { UserType } from '../userTypes';
import { AddressDTO } from './address.dto';
import { UserCredentialsDTO } from './user-credentials.dto';

export class UserDTO {
  creadentials: UserCredentialsDTO;
  firstName: string;
  lastName: string;
  userType: UserType;
  role: any;
  address: AddressDTO;
}

export const getUserDtoFromUser = (user: Partial<User>): Partial<UserDTO> => {
  return {
    creadentials: {
      email: user?.credentials?.email,
      login: user?.credentials?.login,
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    address: user?.address as unknown as any,
    firstName: user?.firstName,
    lastName: user?.lastName,
    role: user?.role?.roleType?.roleType,
    userType: user?.userType,
  };
};
