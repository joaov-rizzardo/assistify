import makeWASocket, { ConnectionState } from '@whiskeysockets/baileys';
import { BaileysStore } from './baileys-store';
import { toDataURL } from 'qrcode';

export type BaileySocketType = ReturnType<typeof makeWASocket>;

export class BaileysSocket {
  private sessionId: string;
  private socket: BaileySocketType;

  constructor(sessionId: string, socket: BaileySocketType) {
    this.sessionId = sessionId;
    this.socket = socket;
    this.listen();
  }

  listen() {}

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
