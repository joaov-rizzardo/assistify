export type GetBaileysSessionReturnType = {
  id: string;
  sessionId: string;
  data: string;
  serverId: string;
};

export abstract class BaileysSessionRepository {
  abstract save(id: string, sessionId: string, data: string): void | Promise<void>;
  abstract delete(id: string, sessionId: string): void | Promise<void>;
  abstract get(id: string, sessionId: string): Promise<GetBaileysSessionReturnType | null> | GetBaileysSessionReturnType | null;
}
