import { InMemoryUserRepository } from 'src/test/repositories/in-memory-user-repository';
import { CreateUserUseCase } from './create-user-use-case';
import { User } from 'src/application/core/entities/user';
import { BcryptPasswordEncrypter } from 'src/infra/libs/bcrypt/bcrypt-password-encrypter';
import { PasswordEncrypter } from 'src/application/core/interfaces/password-encrypter';

describe('Create user use case', () => {
  let inMemoryRepository: InMemoryUserRepository;
  let sut: CreateUserUseCase;
  let passwordEncrypter: PasswordEncrypter;
  beforeEach(() => {
    inMemoryRepository = new InMemoryUserRepository();
    passwordEncrypter = new BcryptPasswordEncrypter();
    sut = new CreateUserUseCase(inMemoryRepository, passwordEncrypter);
  });

  it('should create user', async () => {
    const name = 'John';
    const lastName = 'Doe';
    const password = 'safe_password123';
    const email = 'john.doe@mail.com';
    const result = await sut.execute({
      name,
      lastName,
      password,
      email,
    });

    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      const user = result.value;
      expect(user).toBeInstanceOf(User);
      expect(user.getName()).toBe(name);
      expect(user.getEmail()).toBe(email);
      expect(user.getLastName()).toBe(lastName);
      expect(user.getPassword()).not.toBe(password);
      expect(
        await passwordEncrypter.checkPassword(password, user.getPassword()),
      ).toBe(true);
    }
  });

  it('should check email', async () => {
    await sut.execute({
      name: 'John',
      lastName: 'Doe',
      password: 'safe_password123',
      email: 'john.doe@mail.com',
    });

    const result = await sut.execute({
      name: 'Another',
      lastName: 'User',
      password: 'safe_password123',
      email: 'john.doe@mail.com',
    });

    expect(result.isLeft()).toBe(true);
  });
});
