export abstract class AbstractUserSocketEmitter {
  abstract sendToAll(event: string, payload: unknown): void | Promise<void>;

  abstract sendToUser(userId: string, event: string, payload: unknown): void | Promise<void>;
}
