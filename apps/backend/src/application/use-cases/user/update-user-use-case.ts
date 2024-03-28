import { Injectable } from '@nestjs/common';
import { User } from 'src/application/core/entities/user';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { FileStorage } from 'src/application/core/interfaces/storage/file-storage';
import { Either, left, right } from 'src/application/errors/either';
import { FileNotExistsError } from 'src/application/errors/file-not-exists-error';
import { UserNotExistsError } from 'src/application/errors/user-not-exists-error';
import { ProfilePictureIsNotImageError } from './errors/profile-picture-is-not-image-error';

type UpdateUserArgs = {
  name?: string;
  lastName?: string;
  profilePicture?: string;
};

type UpdateUserUseCaseResponse = Either<UserNotExistsError | FileNotExistsError | ProfilePictureIsNotImageError, User>;

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileStorage: FileStorage
  ) {}

  async execute(userId: string, args: UpdateUserArgs): Promise<UpdateUserUseCaseResponse> {
    if (!(await this.userRepository.checkIfUserExistsById(userId))) {
      return left(new UserNotExistsError(userId));
    }
    if (args.profilePicture) {
      const profilePicture = await this.fileStorage.get(args.profilePicture);
      if (!profilePicture) {
        return left(new FileNotExistsError(args.profilePicture));
      }
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedMimeTypes.includes(profilePicture.mimetype)) {
        return left(new ProfilePictureIsNotImageError(args.profilePicture, profilePicture.mimetype));
      }
    }
    const user = await this.userRepository.update(userId, args);
    if (!user) return left(new UserNotExistsError(userId));
    return right(user);
  }
}
