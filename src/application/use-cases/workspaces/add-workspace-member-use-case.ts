import { Injectable } from '@nestjs/common';
import { AddWorkspaceMemberDTO } from 'src/application/core/dtos/add-workspace-member-dto';
import { WorkspaceMember } from 'src/application/core/entities/workspace-member';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { Either, left, right } from 'src/application/errors/either';
import { UserNotExistsError } from 'src/application/errors/user-not-exists-error';

export type AddWorkspaceMemberUseCaseResponse = Either<
  UserNotExistsError,
  WorkspaceMember
>;

@Injectable()
export class AddWorkspaceMemberUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly workspaceMembersRepository: WorkspaceMembersRepository,
  ) {}

  public async execute(
    workspaceId: string,
    { userId, role }: AddWorkspaceMemberDTO,
  ): Promise<AddWorkspaceMemberUseCaseResponse> {
    if (!(await this.userRepository.checkIfUserExistsById(userId))) {
      return left(new UserNotExistsError(userId));
    }
    const member = await this.workspaceMembersRepository.add({
      workspaceId,
      role,
      userId,
    });
    return right(member);
  }
}
