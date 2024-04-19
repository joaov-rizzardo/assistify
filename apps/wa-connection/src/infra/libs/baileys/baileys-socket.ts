import makeWASocket from '@whiskeysockets/baileys';
import { BaileysStore } from './baileys-store';

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

  static async init(sessionId: string) {
    const store = new BaileysStore(sessionId);
    const { saveCreds, state } = await store.init();
    const socket = makeWASocket({
      auth: state
    });
    socket.ev.on('creds.update', saveCreds);
    return new this(sessionId, socket);
  }
}
