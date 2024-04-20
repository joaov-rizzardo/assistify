import { randomUUID } from 'crypto';
import { BaileysSocket } from '../../infra/libs/baileys/baileys-socket';
import { ClusterConnections } from '../../infra/cluster/cluster-connections';

export type MakeWAConnectionResponse = {
  qrCode: string;
  sessionId: string;
};

export class MakeWAConnetion {
  static async connect(): Promise<MakeWAConnectionResponse> {
    const sessionId = randomUUID();
    const socket = await BaileysSocket.init(sessionId);
    ClusterConnections.add(sessionId, socket);
    const qrCode = await socket.awaitForQR();
    return { qrCode, sessionId };
  }
}
