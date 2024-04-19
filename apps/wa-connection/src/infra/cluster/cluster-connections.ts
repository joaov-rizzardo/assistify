import { BaileysSocket } from '../libs/baileys/baileys-socket';

export class ClusterConnections {
  private sockets: Map<string, BaileysSocket> = new Map();

  add(sessionId: string, socket: BaileysSocket) {
    this.sockets.set(sessionId, socket);
  }

  remove(sessionId: string) {
    this.sockets.delete(sessionId);
  }

  get(sessionId: string) {
    return this.sockets.get(sessionId);
  }
}
