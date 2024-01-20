import { UseCaseError } from 'src/application/errors/use-case-error';

export class UserNotExistsError extends Error implements UseCaseError {
  constructor(userId: string) {
    super(`User not exists: ${userId}`);
  }
}
