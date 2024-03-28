import { UseCaseError } from 'src/application/errors/use-case-error';

export class ProfilePictureIsNotImageError extends Error implements UseCaseError {
  constructor(key: string, mimetype: string) {
    super(`Profile picture key ${key} is not an image: ${mimetype}`);
  }
}
