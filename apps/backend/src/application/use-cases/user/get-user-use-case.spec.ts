import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { GetUserUseCase } from './get-user-use-case';
import { InMemoryUserRepository } from 'src/test/repositories/in-memory-user-repository';
import { User } from 'src/application/core/entities/user';
import { makeUser } from 'src/test/factories/make-user';
import { UserNotExistsError } from 'src/application/errors/user-not-exists-error';
import { v4 as uuid } from 'uuid';

describe('Get user use case', () => {
  let userRepository: UserRepository;
  let user: User;
  let sut: GetUserUseCase;

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    user = await userRepository.create(makeUser());
    sut = new GetUserUseCase(userRepository);
  });

  it("should return user's data", async () => {
    const result = await sut.execute({ userId: user.getId() });
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const responseUser = result.value;
      expect(responseUser).toBeInstanceOf(User);
      expect(responseUser.getId()).toBe(user.getId());
      expect(responseUser.getName()).toBe(user.getName());
      expect(responseUser.getLastName()).toBe(user.getLastName());
      expect(responseUser.getEmail()).toBe(user.getEmail());
    }
  });

  it('should check if user exists', async () => {
    const result = await sut.execute({ userId: uuid() });
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      const error = result.value;
      expect(error).toBeInstanceOf(UserNotExistsError);
    }
  });
});
