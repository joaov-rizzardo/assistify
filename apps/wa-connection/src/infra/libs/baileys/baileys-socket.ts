import makeWASocket, { ConnectionState } from '@whiskeysockets/baileys';
import { BaileysStore } from './baileys-store';
import { toDataURL } from 'qrcode';
import { BaileysConnectionUpdate } from './events/baileys-connection-update';

export type BaileySocketType = ReturnType<typeof makeWASocket>;

export class BaileysSocket {
  private sessionId: string;
  private socket: BaileySocketType;

  constructor(sessionId: string, socket: BaileySocketType) {
    this.sessionId = sessionId;
    this.socket = socket;
    this.listen();
  }

  listen() {
    this.socket.ev.on('connection.update', (data) => BaileysConnectionUpdate.handle(this.sessionId, data));
    this.socket.ev.on('messages.upsert', () => console.log('CHEGOU MENSAGEM'));
  }

  async awaitForQR(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.socket.ev.on('connection.update', (connection: Partial<ConnectionState>) => {
        if (connection.qr) {
          resolve(toDataURL(connection.qr));
        }
      });
      setTimeout(() => reject('Connection timeout while attempting to connect to WA.'), 30000);
    });
  }

  static async init(sessionId: string) {
    const store = new BaileysStore(sessionId);
    const { saveCreds, state } = await store.init();
    const socket = makeWASocket({
      auth: state,
      printQRInTerminal: true
    });
    socket.ev.on('creds.update', saveCreds);
    return new this(sessionId, socket);
  }
}
