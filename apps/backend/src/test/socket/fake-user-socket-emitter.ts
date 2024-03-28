import { AbstractUserSocketEmitter } from 'src/application/core/interfaces/socket/abstract-user-socket-emitter';

export class FakeUserSocketEmitter implements AbstractUserSocketEmitter {
  sendToAll(event: string, payload: unknown): void {
    if (event && payload) return;
  }
  sendToUser(userId: string, event: string, payload: unknown): void {
    if (userId && event && payload) return;
  }
}
