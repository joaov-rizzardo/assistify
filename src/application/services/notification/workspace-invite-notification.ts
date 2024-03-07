import { Injectable } from '@nestjs/common';
import { AbstractUserSocketEmitter } from 'src/application/core/interfaces/socket/abstract-user-socket-emitter';

type CreateArgsType = {
  userId: string;
  workspaceId: string;
  invitingUserId: string;
};

@Injectable()
export class WorkspaceInviteNotification {
  constructor(private readonly userSocket: AbstractUserSocketEmitter) {}

  async create({ invitingUserId, userId, workspaceId }: CreateArgsType) {
    this.userSocket.sendToUser(userId, 'teste', { invitingUserId });
  }
}
