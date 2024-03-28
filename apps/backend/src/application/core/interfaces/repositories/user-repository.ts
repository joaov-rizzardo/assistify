import { CreateUserDTO } from '../../dtos/user/create-user-dto';
import { User } from '../../entities/user';

export type UpdateUserArgs = {
  name?: string;
  lastName?: string;
  profilePicture?: string;
};

export abstract class UserRepository {
  abstract create(args: CreateUserDTO): Promise<User>;
  abstract changePassword(userId: string, password: string): null | User | Promise<User | null>;
  abstract findById(userId: string): Promise<User | null> | User | null;
  abstract findByEmail(email: string): Promise<User> | null;
  abstract checkIfUserExistsByEmail(email: string): Promise<boolean>;
  abstract checkIfUserExistsById(userId: string): Promise<boolean>;
  abstract update(userId: string, args: UpdateUserArgs): Promise<User | null> | User | null;
}
