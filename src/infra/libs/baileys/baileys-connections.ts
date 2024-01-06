import makeWASocket from '@whiskeysockets/baileys';
import { BaileysStore } from './baileys-store';
import { v4 as uuid } from 'uuid';
import { BaileysSessionSocket } from './entities/baileys-session-socket';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { BaileysEventListener } from './baileys-event-listener';
import { BaileysSessionRepository } from './repositories/baileys-session-repository';

export interface ConnectionOptions {
  sessionId?: string;
}

@Injectable()
export class BaileysConnections implements OnModuleInit {
  private sessions = new Map<string, BaileysSessionSocket>();

  constructor(private readonly sessionRepository: BaileysSessionRepository) {}

  async onModuleInit() {
    await this.initSessions();
  }

  public async connect({ sessionId }: ConnectionOptions) {
    const connectionSessionId = sessionId || uuid();
    const store = new BaileysStore(this.sessionRepository, connectionSessionId);
    const state = await store.getState();
    const socket = makeWASocket({
      printQRInTerminal: true,
      auth: state,
      syncFullHistory: false,
    });
    const sessionSocket = new BaileysSessionSocket(socket, connectionSessionId);
    this.sessions.set(connectionSessionId, sessionSocket);
    const listener = new BaileysEventListener(this, store, sessionSocket);
    listener.listen();
  }

  public async deleteSession(sessionId: string) {
    if (this.sessions.delete(sessionId)) {
      await this.sessionRepository.deleteSessionById(sessionId);
    }
  }

  private async initSessions() {
    const sessions = await this.sessionRepository.findActiveSessions();
    sessions.forEach((session) =>
      this.connect({ sessionId: session.getSessionId }),
    );
  }
}
