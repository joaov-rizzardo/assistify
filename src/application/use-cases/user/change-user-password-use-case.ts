import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { Either, left, right } from 'src/application/errors/either';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { PasswordEncrypter } from 'src/application/core/interfaces/cryptography/password-encrypter';
import { User } from 'src/application/core/entities/user';
import { IncorrectUserPasswordError } from './errors/incorrect-user-password-error';
import { UserNotExistsError } from 'src/application/errors/user-not-exists-error';

type UpdatePasswordArgsType = {
  currentPassword: string;
  newPassword: string;
  userId: string;
};

type CreateUserUseCaseResponse = Either<
  UserAlreadyExistsError | IncorrectUserPasswordError,
  User
>;

@Injectable()
export class ChangeUserPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordEncrypter: PasswordEncrypter,
  ) {}

  async execute({
    currentPassword,
    newPassword,
    userId,
  }: UpdatePasswordArgsType): Promise<CreateUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return left(new UserNotExistsError(userId));
    }
    if (
      !(await this.passwordEncrypter.checkPassword(
        currentPassword,
        user.getPassword(),
      ))
    ) {
      return left(new IncorrectUserPasswordError(userId));
    }
    const updatedUser = await this.userRepository.changePassword(
      userId,
      newPassword,
    );
    if (!updatedUser) {
      return left(new UserNotExistsError(userId));
    }
    return right(updatedUser);
  }
}
