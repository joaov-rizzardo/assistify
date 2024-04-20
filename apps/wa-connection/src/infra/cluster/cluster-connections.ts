import { BaileysSocket } from '../libs/baileys/baileys-socket';

export class ClusterConnections {
  private static sockets: Map<string, BaileysSocket> = new Map();

  static add(sessionId: string, socket: BaileysSocket) {
    this.sockets.set(sessionId, socket);
  }

  static remove(sessionId: string) {
    this.sockets.delete(sessionId);
  }

  static get(sessionId: string) {
    return this.sockets.get(sessionId);
  }
}
