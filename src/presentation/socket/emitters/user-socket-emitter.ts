import { AbstractUserSocketEmitter } from 'src/application/core/interfaces/socket/abstract-user-socket-emitter';
import { UserSocketGateway } from '../user-socket-gateway';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserSocketEmitter implements AbstractUserSocketEmitter {
  constructor(private readonly socket: UserSocketGateway) {}

  sendToAll(event: string, payload: any) {
    this.socket.server.emit(event, payload);
  }

  sendToUser(userId: string, event: string, payload: any) {
    const userRoomName = this.socket.getUserRoomName(userId);
    this.socket.server.to(userRoomName).emit(event, payload);
  }
}
