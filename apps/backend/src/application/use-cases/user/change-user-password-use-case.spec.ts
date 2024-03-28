import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { ChangeUserPasswordUseCase } from './change-user-password-use-case';
import { InMemoryUserRepository } from 'src/test/repositories/in-memory-user-repository';
import { PasswordEncrypter } from 'src/application/core/interfaces/cryptography/password-encrypter';
import { BcryptPasswordEncrypter } from 'src/infra/libs/bcrypt/bcrypt-password-encrypter';
import { makeUser } from 'src/test/factories/make-user';
import { faker } from '@faker-js/faker';
import { v4 as uuid } from 'uuid';
import { UserNotExistsError } from 'src/application/errors/user-not-exists-error';
import { IncorrectUserPasswordError } from './errors/incorrect-user-password-error';

describe('Change user password use case', () => {
  let userRepository: UserRepository;
  let passwordEncrypter: PasswordEncrypter;
  let sut: ChangeUserPasswordUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    passwordEncrypter = new BcryptPasswordEncrypter();
    sut = new ChangeUserPasswordUseCase(userRepository, passwordEncrypter);
  });

  it("should change user's password", async () => {
    const { name, lastName, email, password } = makeUser();
    const user = await userRepository.create({
      name,
      lastName,
      email,
      password: await passwordEncrypter.encryptPassword(password)
    });
    const result = await sut.execute({
      userId: user.getId(),
      currentPassword: password,
      newPassword: faker.internet.password()
    });
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      expect(result.value.getPassword()).not.toEqual(user.getPassword());
    }
  });

  it('should check if user exists', async () => {
    const result = await sut.execute({
      userId: uuid(),
      currentPassword: faker.internet.password(),
      newPassword: faker.internet.password()
    });
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UserNotExistsError);
    }
  });

  it('should check current password', async () => {
    const { name, lastName, email, password } = makeUser();
    const user = await userRepository.create({
      name,
      lastName,
      email,
      password: await passwordEncrypter.encryptPassword(password)
    });
    const result = await sut.execute({
      userId: user.getId(),
      currentPassword: faker.internet.password(),
      newPassword: faker.internet.password()
    });
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(IncorrectUserPasswordError);
    }
  });
});
