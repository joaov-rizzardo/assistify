export abstract class AbstractUserSocketEmitter {
  abstract sendToAll(event: string, payload: any): void | Promise<void>;

  abstract sendToUser(
    userId: string,
    event: string,
    payload: any,
  ): void | Promise<void>;
}
