import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/application/errors/either';
import { UserIsNotMemberFromWorkspaceError } from './errors/user-is-not-member-from-workspace-error';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { CannotRemoveOwnerFromWorkspaceError } from './errors/cannot-remove-owner-from-workspace-error';

export type RemoveWorkspaceMemberUseCaseResponse = Either<
  UserIsNotMemberFromWorkspaceError | CannotRemoveOwnerFromWorkspaceError,
  boolean
>;

@Injectable()
export class RemoveWorkspaceMemberUseCase {
  constructor(
    private readonly workspaceMemberRepository: WorkspaceMembersRepository,
  ) {}
  async execute(
    workspaceId: string,
    userId: string,
  ): Promise<RemoveWorkspaceMemberUseCaseResponse> {
    const member = await this.workspaceMemberRepository.findWorkspaceMember(
      workspaceId,
      userId,
    );
    if (!member) {
      return left(new UserIsNotMemberFromWorkspaceError(workspaceId, userId));
    }
    if (member.getRole() === 'owner') {
      return left(new CannotRemoveOwnerFromWorkspaceError(workspaceId, userId));
    }
    await this.workspaceMemberRepository.remove(userId, workspaceId);
    return right(true);
  }
}
