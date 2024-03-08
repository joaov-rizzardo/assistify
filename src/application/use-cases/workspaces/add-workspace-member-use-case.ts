import { Injectable } from '@nestjs/common';
import { WorkspaceMember } from 'src/application/core/entities/workspace-member';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { Either, left, right } from 'src/application/errors/either';
import { UserNotExistsError } from 'src/application/errors/user-not-exists-error';
import { CannotAddMemberAsOwnerError } from './errors/cannot-add-member-as-owner-error';
import { WorkspaceInviteNotification } from 'src/application/services/notification/workspace-invite-notification';
import { WorkspaceMemberRoles } from './types/workspace-member-roles';

export type AddWorkspaceMemberUseCaseResponse = Either<
  UserNotExistsError | CannotAddMemberAsOwnerError,
  WorkspaceMember
>;

type AddMemberArgs = {
  userId: string;
  role: WorkspaceMemberRoles;
  invitingUserId: string;
};
@Injectable()
export class AddWorkspaceMemberUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly workspaceMembersRepository: WorkspaceMembersRepository,
    private readonly workspaceInviteNotification: WorkspaceInviteNotification,
  ) {}

  public async execute(
    workspaceId: string,
    { userId, role, invitingUserId }: AddMemberArgs,
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
      status: 'invited',
    });
    await this.workspaceInviteNotification.create({
      invitingUserId: invitingUserId,
      userId,
      workspaceId,
    });
    return right(member);
  }
}
