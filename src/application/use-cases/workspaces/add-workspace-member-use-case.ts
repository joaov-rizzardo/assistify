import { Injectable } from '@nestjs/common';
import { WorkspaceMember } from 'src/application/core/entities/workspace-member';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { Either, left, right } from 'src/application/errors/either';
import { UserNotExistsError } from 'src/application/errors/user-not-exists-error';
import { CannotAddMemberAsOwnerError } from './errors/cannot-add-member-as-owner-error';
import { AddWorkspaceMemberDTO } from 'src/application/core/dtos/workspace/add-workspace-member-dto';

export type AddWorkspaceMemberUseCaseResponse = Either<
  UserNotExistsError | CannotAddMemberAsOwnerError,
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
    if (role === 'owner') {
      return left(new CannotAddMemberAsOwnerError(workspaceId, userId));
    }
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
