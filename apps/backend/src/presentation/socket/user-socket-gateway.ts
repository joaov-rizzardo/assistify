import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, UsePipes } from '@nestjs/common';
import { SocketUserAuthenticationGuard } from 'src/infra/guards/socket-user-authentication.guard';
import { JoinUserRoomDTO, JoinUserRoomSchema } from 'src/application/core/dtos/socket/join-user-room-dto';
import { WsZodValidationPipe } from 'src/infra/pipes/ws-zod-validation-pipe';
import { LeaveUserRoomDTO, LeaveUserRoomSchema } from 'src/application/core/dtos/socket/leave-user-room-dto';
import { UserSocketEventsOutput } from './events/user-socket-events';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class UserSocketGateway {
  @WebSocketServer()
  server: Server;

  @UsePipes(new WsZodValidationPipe(JoinUserRoomSchema))
  @UseGuards(SocketUserAuthenticationGuard)
  @SubscribeMessage(UserSocketEventsOutput.Join)
  onJoin(socket: Socket, { userId }: JoinUserRoomDTO) {
    const userRoomName = this.getUserRoomName(userId);
    socket.join(userRoomName);
  }

  @UsePipes(new WsZodValidationPipe(LeaveUserRoomSchema))
  @UseGuards(SocketUserAuthenticationGuard)
  @SubscribeMessage(UserSocketEventsOutput.Leave)
  onLeave(socket: Socket, { userId }: LeaveUserRoomDTO) {
    const userRoomName = this.getUserRoomName(userId);
    socket.leave(userRoomName);
  }

  getUserRoomName(userId: string) {
    return `USER_ROOM:${userId}`;
  }
}
