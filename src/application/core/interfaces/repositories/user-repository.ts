import { CreateUserDTO } from '../../dtos/create-user-dto';
import { User } from '../../entities/user';

export abstract class UserRepository {
  abstract create({}: CreateUserDTO): Promise<User>;
  abstract findByEmail(email: string): Promise<User> | null;
  abstract checkIfUserExistsByEmail(email: string): Promise<boolean>;
  abstract checkIfUserExistsById(userId: string): Promise<boolean>;
}
