import { UseCaseError } from 'src/application/errors/use-case-error';

export class IncorrectUserPasswordError extends Error implements UseCaseError {
  constructor(userId: string) {
    super(`Incorrect user password for user: ${userId}`);
  }
}
