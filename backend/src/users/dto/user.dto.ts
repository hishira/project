import { UserType } from '../userTypes';
import { UserCredentialsDTO } from './user-credentials.dto';

export class UserDTO {
  creadentials: UserCredentialsDTO;
  firstName: string;
  lastName: string;
  userType: UserType;
  role: any;
}
