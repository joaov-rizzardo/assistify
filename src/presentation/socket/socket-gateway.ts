import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinRoomDTO } from 'src/application/core/dtos/socket/join-room-dto';
import { LeaveRoomDTO } from 'src/application/core/dtos/socket/leave-room-dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection() {}

  handleDisconnect() {}

  @SubscribeMessage('join-room')
  handleJoinRoom(socket: Socket, data: JoinRoomDTO) {
    socket.join(data.name);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(socket: Socket, data: LeaveRoomDTO) {
    socket.leave(data.name);
  }

  emitMessageToAll(event: string, payload: any) {
    this.server.emit(event, payload);
  }

  emitMessageToRoom(roomName: string, event: string, payload: any) {
    this.server.to(roomName).emit(event, payload);
  }
}
