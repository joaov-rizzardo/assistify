import { CreateUserDTO } from '../../dtos/create-user-dto';
import { User } from '../../entities/user';

export abstract class UserRepository {
  abstract create({}: CreateUserDTO): Promise<User>;
  abstract checkUserExistsByEmail(email: string): Promise<boolean>;
}
