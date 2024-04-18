import { AuthenticationCreds, BufferJSON, SignalDataSet, SignalDataTypeMap, initAuthCreds, proto } from '@whiskeysockets/baileys';
import { BaileysSessionRepository } from '../../../application/core/interfaces/repositories/baileys-session-repository';
import { RepositoryConfigs } from '../../../application/configs/repository-configs';

export class BaileysStore {
  private sessionId: string;
  private baileysSessionRepo: BaileysSessionRepository;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.baileysSessionRepo = RepositoryConfigs.getRepositoryInstance(BaileysSessionRepository);
  }

  async init() {
    const creds: AuthenticationCreds = ((await this.read('creds')) as AuthenticationCreds) || initAuthCreds();
    return {
      state: {
        keys: this.getKeys(),
        creds
      },
      saveCreds: () => this.write(creds, 'creds')
    };
  }

  private getKeys() {
    return {
      get: async <T extends keyof SignalDataTypeMap>(type: T, ids: string[]) => {
        const data: { [key: string]: SignalDataTypeMap[typeof type] } = {};
        ids.forEach(async (id) => {
          let value = await this.read(`${type}-${id}`);
          if (type === 'app-state-sync-key' && value) {
            value = proto.Message.AppStateSyncKeyData.fromObject(value);
          }
          data[id] = value;
        });
        return data;
      },
      set: async (data: SignalDataSet) => {
        Object.entries(data).forEach(async ([category, items]) => {
          Object.entries(items).forEach(async ([id, value]) => {
            const compositeId = `${category}-${id}`;
            value ? await this.write(value, compositeId) : await this.del(compositeId);
          });
        });
      }
    };
  }

  private async write(data: unknown, id: string) {
    await this.baileysSessionRepo.save(id, this.sessionId, JSON.stringify(data, BufferJSON.replacer));
  }

  private async read(id: string) {
    const session = await this.baileysSessionRepo.get(id, this.sessionId);
    if (!session) return null;
    return JSON.parse(session.data, BufferJSON.reviver);
  }

  private async del(id: string) {
    await this.baileysSessionRepo.delete(id, this.sessionId);
  }
}
