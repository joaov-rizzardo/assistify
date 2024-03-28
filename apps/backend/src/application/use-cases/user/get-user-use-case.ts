import { Injectable } from '@nestjs/common';
import { User } from 'src/application/core/entities/user';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { Either, left, right } from 'src/application/errors/either';
import { UserNotExistsError } from 'src/application/errors/user-not-exists-error';

type GetUserUseCaseResponse = Either<UserNotExistsError, User>;

type CreateArgsType = {
  userId: string;
};

@Injectable()
export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId }: CreateArgsType): Promise<GetUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) return left(new UserNotExistsError(userId));
    return right(user);
  }
}
