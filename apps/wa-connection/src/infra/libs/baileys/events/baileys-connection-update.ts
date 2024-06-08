import { Boom } from '@hapi/boom';
import { ConnectionState, DisconnectReason } from '@whiskeysockets/baileys';
import { BaileysSocket } from '../baileys-socket';
import { ClusterConnections } from '../../../cluster/cluster-connections';

export class BaileysConnectionUpdate {
  static async handle(sessionId: string, args: Partial<ConnectionState>) {
    const { connection, lastDisconnect } = args;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      //   console.log(lastDisconnect?.error); // Motivo de desconexão
      if (shouldReconnect) {
        const socket = await BaileysSocket.init(sessionId);
        ClusterConnections.add(sessionId, socket);
      }
    }

    if (connection === 'open') {
      console.log('opened connection');
    }
  }
}
