import { AbstractUserSocketEmitter } from 'src/application/core/interfaces/socket/abstract-user-socket-emitter';

export class FakeUserSocketEmitter implements AbstractUserSocketEmitter {
  sendToAll(event: string, payload: any): void {
    if (event && payload) return;
  }
  sendToUser(userId: string, event: string, payload: any): void {
    if (userId && event && payload) return;
  }
}
