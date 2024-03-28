import { Injectable } from '@nestjs/common';
import { TokenGenerator } from 'src/application/core/interfaces/tokens/token-generator';
import { Either, left, right } from 'src/application/errors/either';
import { NotValidRefreshTokenError } from './errors/not-valid-refresh-token-error';
import { RefreshTokenDTO } from 'src/application/core/dtos/authentication/refresh-token-dto';

type RefreshTokenUseCaseResponse = Either<
  NotValidRefreshTokenError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly tokenGenerator: TokenGenerator) {}

  async execute({ refreshToken }: RefreshTokenDTO): Promise<RefreshTokenUseCaseResponse> {
    if (!(await this.tokenGenerator.checkRefreshToken(refreshToken))) {
      return left(new NotValidRefreshTokenError(refreshToken));
    }
    const decodedRefreshToken = await this.tokenGenerator.decodeRefreshToken(refreshToken);
    const newAccessToken = await this.tokenGenerator.generateAccessToken(decodedRefreshToken.userId);
    return right({
      accessToken: newAccessToken
    });
  }
}
