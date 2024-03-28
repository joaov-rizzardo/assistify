import { Injectable } from '@nestjs/common';
import { UserNotification } from 'src/application/core/entities/user-notification';
import { UserNotificationRepository } from 'src/application/core/interfaces/repositories/user-notification-repository';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { Either, left, right } from 'src/application/errors/either';
import { NotificationIsNotWorkspaceInviteError } from './errors/notification-is-not-workspace-invite-error';
import { WorkspaceInviteIsNotValidError } from './errors/workspace-invite-is-not-valid-error';
import { WorkspaceInviteIsAlreadyAcceptedError } from './errors/workspace-invite-is-already-accepted-error';

type RespondWorkspaceInviteUseCaseResponse = Either<
  NotificationIsNotWorkspaceInviteError | WorkspaceInviteIsNotValidError | WorkspaceInviteIsAlreadyAcceptedError,
  UserNotification
>;

@Injectable()
export class RespondWorkspaceInviteUseCase {
  constructor(
    private readonly workspaceMembersRepository: WorkspaceMembersRepository,
    private readonly userNotificationRepository: UserNotificationRepository
  ) {}

  async execute(notification: UserNotification, operation: 'accept' | 'reject'): Promise<RespondWorkspaceInviteUseCaseResponse> {
    if (notification.getType() !== 'workspace_invite' || notification.getContent()?.type !== 'workspace_invite') {
      return left(new NotificationIsNotWorkspaceInviteError(notification.getId()));
    }
    const workspaceId = notification.getContent().workspaceId;
    const updatedNotification = await this.userNotificationRepository.read(notification.getId());
    const workspaceMember = await this.workspaceMembersRepository.findWorkspaceMember(workspaceId, notification.getUserId());
    if (!workspaceMember) {
      return left(new WorkspaceInviteIsNotValidError(notification.getId(), notification.getUserId(), workspaceId));
    }
    if (workspaceMember.getStatus() === 'accepted') {
      return left(new WorkspaceInviteIsAlreadyAcceptedError(notification.getUserId(), workspaceId));
    }
    if (operation === 'accept') {
      await this.workspaceMembersRepository.changeMemberStatus(notification.getUserId(), workspaceId, 'accepted');
    }
    if (operation === 'reject') {
      await this.workspaceMembersRepository.remove(notification.getUserId(), workspaceId);
    }
    return right(updatedNotification);
  }
}
