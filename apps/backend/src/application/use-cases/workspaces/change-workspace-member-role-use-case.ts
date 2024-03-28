import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/application/errors/either';
import { UserIsNotMemberFromWorkspaceError } from './errors/user-is-not-member-from-workspace-error';
import { WorkspaceMemberRoles } from './types/workspace-member-roles';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { WorkspaceMember } from 'src/application/core/entities/workspace-member';
import { CannotChangeMemberRoleToOwnerError } from './errors/cannot-change-member-role-to-owner-error';

export type ChangeWorkspaceMemberRoleUseCaseResponse = Either<
  UserIsNotMemberFromWorkspaceError | CannotChangeMemberRoleToOwnerError,
  WorkspaceMember
>;

@Injectable()
export class ChangeWorkspaceMemberRoleUseCase {
  constructor(private readonly workspaceMemberRepository: WorkspaceMembersRepository) {}
  async execute(workspaceId: string, userId: string, role: WorkspaceMemberRoles): Promise<ChangeWorkspaceMemberRoleUseCaseResponse> {
    if (role === 'owner') {
      return left(new CannotChangeMemberRoleToOwnerError(workspaceId, userId));
    }
    const updatedMember = await this.workspaceMemberRepository.changeMemberRole(userId, workspaceId, role);
    if (updatedMember === null) {
      return left(new UserIsNotMemberFromWorkspaceError(workspaceId, userId));
    }
    return right(updatedMember);
  }
}
