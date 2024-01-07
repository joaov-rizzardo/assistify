import { UseCaseError } from 'src/application/errors/use-case-error';

export class UserAlreadyExistsError extends Error implements UseCaseError {
  constructor(email: string) {
    super(`Email is already in use: ${email}`);
  }
}
