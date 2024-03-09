import { Injectable } from '@nestjs/common';
import { UserNotificationRepository } from 'src/application/core/interfaces/repositories/user-notification-repository';
import { AbstractUserSocketEmitter } from 'src/application/core/interfaces/socket/abstract-user-socket-emitter';
import { UserSocketEventsInput } from 'src/presentation/socket/events/user-socket-events';

type CreateArgsType = {
  userId: string;
  workspaceId: string;
  invitingUserId: string;
};

@Injectable()
export class SendWorkspaceInviteUseCase {
  constructor(
    private readonly userSocket: AbstractUserSocketEmitter,
    private readonly userNotificationRepository: UserNotificationRepository,
  ) {}

  async execute({ invitingUserId, userId, workspaceId }: CreateArgsType) {
    const notification = await this.userNotificationRepository.create({
      type: 'workspace_invite',
      userId: userId,
      content: {
        type: 'workspace_invite',
        invitingUserId,
        workspaceId,
      },
    });
    this.userSocket.sendToUser(
      userId,
      UserSocketEventsInput.Notification,
      notification.toObject(),
    );
    return notification;
  }
}
