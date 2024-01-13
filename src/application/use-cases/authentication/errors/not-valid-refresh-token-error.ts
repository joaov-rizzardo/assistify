import { UseCaseError } from 'src/application/errors/use-case-error';

export class NotValidRefreshTokenError extends Error implements UseCaseError {
  constructor(refreshToken: string) {
    super(`Refresh token ${refreshToken} is invalid`);
  }
}
