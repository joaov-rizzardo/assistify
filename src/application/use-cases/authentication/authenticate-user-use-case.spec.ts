import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { AuthenticateUserUseCase } from './authenticate-user-use-case';
import { InMemoryUserRepository } from 'src/test/repositories/in-memory-user-repository';
import { BcryptPasswordEncrypter } from 'src/infra/libs/bcrypt/bcrypt-password-encrypter';
import { makeUser } from 'src/test/factories/make-user';
import { PasswordEncrypter } from 'src/application/core/interfaces/cryptography/password-encrypter';
import { TokenGenerator } from 'src/application/core/interfaces/tokens/token-generator';
import { JwtTokenGenerator } from 'src/infra/libs/jwt/jwt-token-generator';

describe('User authentication use case', () => {
  let sut: AuthenticateUserUseCase;
  let inMemoryRepository: UserRepository;
  let passwordEncrypter: PasswordEncrypter;
  let tokenGenerator: TokenGenerator;
  const { name, lastName, email, password } = makeUser();

  beforeEach(async () => {
    inMemoryRepository = new InMemoryUserRepository();
    passwordEncrypter = new BcryptPasswordEncrypter();
    tokenGenerator = new JwtTokenGenerator();
    await inMemoryRepository.create({
      name,
      lastName,
      email,
      password: await passwordEncrypter.encryptPassword(password),
    });
    sut = new AuthenticateUserUseCase(
      inMemoryRepository,
      passwordEncrypter,
      tokenGenerator,
    );
  });

  it('should log in', async () => {
    const result = await sut.execute({ email, password });
    expect(result.isLeft()).toBe(false);
    if (result.isRight()) {
      const { accessToken, refreshToken } = result.value;
      expect(typeof accessToken).toBe('string');
      expect(accessToken.length).toBeGreaterThan(0);
      expect(typeof refreshToken).toBe('string');
      expect(refreshToken.length).toBeGreaterThan(0);
    }
  });

  it('should not log in with wrong password', async () => {
    const wrongPassword = 'Safe_password123@';
    const result = await sut.execute({ email, password: wrongPassword });
    expect(result.isLeft()).toBe(true);
  });

  it('should not log in with wrong email', async () => {
    const wrongEmail = 'wrong@mail.com';
    const result = await sut.execute({ email: wrongEmail, password });
    expect(result.isLeft()).toBe(true);
  });
});
