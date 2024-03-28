import { UseCaseError } from 'src/application/errors/use-case-error';

export class FileNotExistsError extends Error implements UseCaseError {
  constructor(key: string) {
    super(`File not exists: ${key}`);
  }
}
