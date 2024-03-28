import { CreateUserDTO } from 'src/application/core/dtos/user/create-user-dto';
import { User } from 'src/application/core/entities/user';
import { UpdateUserArgs, UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { v4 as uuid } from 'uuid';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async create({ name, lastName, email, password }: CreateUserDTO): Promise<User> {
    const user = new User({
      id: uuid(),
      name,
      lastName,
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    this.users.push(user);
    return user;
  }

  findById(userId: string): User | null {
    return this.users.find((user) => user.getId() === userId) || null;
  }

  async checkIfUserExistsByEmail(email: string): Promise<boolean> {
    const user = this.users.find((user) => user.getEmail() === email);
    return user !== undefined;
  }

  async checkIfUserExistsById(userId: string): Promise<boolean> {
    const user = this.users.find((user) => user.getId() === userId);
    return user !== undefined;
  }

  async findByEmail(email: string): Promise<User> | null {
    const user = this.users.find((user) => user.getEmail() === email);
    return user || null;
  }

  changePassword(userId: string, password: string): User | null {
    this.users = this.users.map((user) =>
      user.getId() === userId
        ? new User({
            ...user.toObject(),
            password
          })
        : user
    );
    return this.users.find((user) => user.getId() === userId) || null;
  }

  update(userId: string, args: UpdateUserArgs): User | null {
    this.users = this.users.map((user) => {
      if (user.getId() === userId) {
        return new User({
          ...user.toObject(),
          name: args.name || user.getName(),
          lastName: args.lastName || user.getLastName(),
          profilePicture: args.profilePicture || user.getProfilePicture()
        });
      }
      return user;
    });
    return this.users.find((user) => user.getId() === userId) || null;
  }
}
