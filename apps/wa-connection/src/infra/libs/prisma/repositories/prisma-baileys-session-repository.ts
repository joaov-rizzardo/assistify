import { EnvironmentConfigs } from '../../../../application/configs/environment-configs';
import {
  BaileysSessionRepository,
  GetBaileysSessionReturnType
} from '../../../../application/core/interfaces/repositories/baileys-session-repository';
import { PrismaProvider } from '../prisma-provider';

export class PrismaBaileysSessionRepository implements BaileysSessionRepository {
  private prismaProvider: PrismaProvider;

  constructor() {
    this.prismaProvider = PrismaProvider.getInstance();
  }

  async save(id: string, sessionId: string, data: string): Promise<void> {
    try {
      await this.prismaProvider.client.baileysSession.upsert({
        create: {
          data,
          id,
          sessionId,
          serverId: EnvironmentConfigs.getEnvironmentVariable('SERVER_ID')
        },
        update: { data },
        where: {
          sessionId_id: { sessionId, id }
        }
      });
    } catch (error) {
      console.log((error as Error).message);
    }
  }
  async delete(id: string, sessionId: string): Promise<void> {
    try {
      await this.prismaProvider.client.baileysSession.delete({
        where: {
          sessionId_id: { sessionId, id }
        }
      });
    } catch (error) {
      console.log((error as Error).message);
    }
  }

  async get(id: string, sessionId: string): Promise<GetBaileysSessionReturnType | null> {
    try {
      const result = await this.prismaProvider.client.baileysSession.findUnique({
        where: {
          sessionId_id: { sessionId, id }
        }
      });
      if (!result) return null;
      return {
        data: result.data,
        id: result.id,
        sessionId: result.sessionId,
        serverId: result.serverId
      };
    } catch (error) {
      console.log((error as Error).message);
      return null;
    }
  }
}
