// import { BaileysSession } from '../entities/baileys-session';

// export type BaileysSessionUpsertType = {
//   id: string;
//   sessionId: string;
//   data: unknown;
// };

// export abstract class BaileysSessionRepository {
//   abstract deleteByIdAndSessionId(id: string, sessionId: string): Promise<void>;
//   abstract findByIdAndSessionId(id: string, sessionId: string): Promise<BaileysSession>;
//   abstract upsert({ id, sessionId, data }: BaileysSessionUpsertType): Promise<BaileysSession>;
//   abstract findActiveSessions(): Promise<BaileysSession[]>;
//   abstract deleteSessionById(sessionId: string): Promise<void>;
// }
