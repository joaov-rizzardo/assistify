import { CreateUserDTO } from 'src/application/core/dtos/create-user-dto';
import { User } from 'src/application/core/entities/user';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { v4 as uuid } from 'uuid';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async create({
    name,
    lastName,
    email,
    password,
  }: CreateUserDTO): Promise<User> {
    const user = new User({
      id: uuid(),
      name,
      lastName,
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.users.push(user);
    return user;
  }

  async checkUserExistsByEmail(email: string): Promise<boolean> {
    const user = this.users.find((user) => user.getEmail() === email);
    return user !== undefined;
  }

  async findByEmail(email: string): Promise<User> | null {
    const user = this.users.find((user) => user.getEmail() === email);
    return user || null;
  }
}
