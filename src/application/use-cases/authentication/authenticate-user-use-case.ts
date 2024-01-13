import { Injectable } from '@nestjs/common';
import { AuthenticateUserDTO } from 'src/application/core/dtos/authenticate-user-dto';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { Either, left, right } from 'src/application/errors/either';
import { AuthenticationBadCredentialsError } from './errors/authentication-bad-credentials-error';
import { TokenGenerator } from 'src/application/core/interfaces/tokens/token-generator';
import { PasswordEncrypter } from 'src/application/core/interfaces/cryptography/password-encrypter';

type AuthenticateUserUseCaseResponse = Either<
  AuthenticationBadCredentialsError,
  {
    accessToken: string;
    refreshToken: string;
  }
>;

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordEncryter: PasswordEncrypter,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserDTO): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (user === null) {
      return left(new AuthenticationBadCredentialsError());
    }
    if (
      (await this.passwordEncryter.checkPassword(
        password,
        user.getPassword(),
      )) === false
    ) {
      return left(new AuthenticationBadCredentialsError());
    }
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenGenerator.generateAccessToken(user.getId()),
      this.tokenGenerator.generateRefreshToken(user.getId()),
    ]);
    return right({
      accessToken,
      refreshToken,
    });
  }
}
