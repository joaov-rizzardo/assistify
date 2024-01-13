import { InMemoryUserRepository } from 'src/test/repositories/in-memory-user-repository';
import { CreateUserUseCase } from './create-user-use-case';
import { User } from 'src/application/core/entities/user';
import { BcryptPasswordEncrypter } from 'src/infra/libs/bcrypt/bcrypt-password-encrypter';
import { makeUser } from 'src/test/factories/make-user';
import { PasswordEncrypter } from 'src/application/core/interfaces/cryptography/password-encrypter';

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
    const { name, lastName, email, password } = makeUser();
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
    const { name, lastName, email, password } = makeUser();

    await sut.execute({ name, lastName, email, password });

    const result = await sut.execute({
      ...makeUser(),
      email: email,
    });

    expect(result.isLeft()).toBe(true);
  });
});
