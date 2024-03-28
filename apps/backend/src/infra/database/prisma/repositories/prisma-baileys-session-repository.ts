// import { Injectable } from '@nestjs/common';
// import { BaileysSessionRepository, BaileysSessionUpsertType } from 'src/infra/libs/baileys/repositories/baileys-session-repository';
// import { PrismaProvider } from '../prisma-provider';
// import { BaileysSession } from 'src/infra/libs/baileys/entities/baileys-session';

// @Injectable()
// export class PrismaBaileysSessionRepository implements BaileysSessionRepository {
//   constructor(private readonly prisma: PrismaProvider) {}

//   public async deleteByIdAndSessionId(id: string, sessionId: string): Promise<void> {
//     await this.prisma.client.baileysSession.delete({
//       select: { pkId: true },
//       where: {
//         sessionId_id: { id, sessionId }
//       }
//     });
//   }

//   public async findByIdAndSessionId(id: string, sessionId: string): Promise<BaileysSession> {
//     const session = await this.prisma.client.baileysSession.findUnique({
//       where: { sessionId_id: { id, sessionId } }
//     });
//     return session ? new BaileysSession(session.pkId, session.id, session.sessionId, session.data) : null;
//   }

//   public async upsert({ id, sessionId, data }: BaileysSessionUpsertType): Promise<BaileysSession> {
//     const session = await this.prisma.client.baileysSession.upsert({
//       create: { data, id, sessionId },
//       update: { data },
//       where: { sessionId_id: { id, sessionId } }
//     });
//     return new BaileysSession(session.pkId, session.id, session.sessionId, session.data);
//   }

//   public async findActiveSessions(): Promise<BaileysSession[]> {
//     const sessions = await this.prisma.client.baileysSession.findMany({
//       where: { id: 'creds' }
//     });
//     return sessions.map((session) => new BaileysSession(session.pkId, session.id, session.sessionId, session.data));
//   }

//   public async deleteSessionById(sessionId: string): Promise<void> {
//     await this.prisma.client.baileysSession.deleteMany({
//       where: { sessionId }
//     });
//   }
// }
