import { BaileysSessionSocket } from './entities/baileys-session-socket';
import { BaileysConnections } from './baileys-connections';
import { BaileysStore } from './baileys-store';
import { ConnectionState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';

export class BaileysEventListener {
  constructor(
    private readonly connections: BaileysConnections,
    private readonly sessionStore: BaileysStore,
    private readonly sessionSocket: BaileysSessionSocket,
  ) {}

  public listen() {
    const socket = this.sessionSocket.getSocket;
    socket.ev.on(
      'creds.update',
      this.sessionStore.saveCreds.bind(this.sessionStore),
    );
    socket.ev.on('connection.update', this.handleConnectionUpdate.bind(this));
    socket.ev.on('messages.upsert', (message) => console.log(message));
  }

  private handleConnectionUpdate({
    connection,
    lastDisconnect,
  }: Partial<ConnectionState>) {
    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      if (shouldReconnect) {
        this.connections.connect({
          sessionId: this.sessionSocket.getSessionId,
        });
      } else {
        this.disconnectSocket();
      }
    }
  }

  private async disconnectSocket() {
    await this.connections.deleteSession(this.sessionSocket.getSessionId);
  }
}
