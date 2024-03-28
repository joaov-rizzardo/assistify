import { AuthenticationCreds, BufferJSON, SignalDataTypeMap, initAuthCreds, proto } from '@whiskeysockets/baileys';
import { BaileysSessionRepository } from './repositories/baileys-session-repository';

export class BaileysStore {
  private creds: AuthenticationCreds;

  constructor(
    private readonly sessionRepository: BaileysSessionRepository,
    private readonly sessionId: string
  ) {}

  public async getState() {
    this.creds = ((await this.read('creds')) as AuthenticationCreds) || initAuthCreds();
    const state = {
      creds: this.creds,
      keys: {
        get: async <T extends keyof SignalDataTypeMap>(type: T, ids: string[]) => {
          const data: { [key: string]: SignalDataTypeMap[typeof type] } = {};
          await Promise.all(
            ids.map(async (id) => {
              let value = await this.read(`${type}-${id}`);
              if (type === 'app-state-sync-key' && value) {
                value = proto.Message.AppStateSyncKeyData.fromObject(value);
              }
              data[id] = value;
            })
          );
          return data;
        },
        set: async (data: unknown) => {
          const tasks: Promise<void>[] = [];

          for (const category in data) {
            for (const id in data[category]) {
              const value = data[category][id];
              const sId = `${category}-${id}`;
              tasks.push(value ? this.write(value, sId) : this.del(sId));
            }
          }
          await Promise.all(tasks);
        }
      }
    };
    return state;
  }

  public saveCreds() {
    return this.write(this.creds, 'creds');
  }

  private async write(data: unknown, id: string) {
    try {
      data = JSON.stringify(data, BufferJSON.replacer);
      id = this.fixId(id);
      await this.sessionRepository.upsert({
        id: id,
        data,
        sessionId: this.sessionId
      });
    } catch (error) {
      console.log(error);
    }
  }

  private async read(id: string) {
    try {
      id = this.fixId(id);
      const session = await this.sessionRepository.findByIdAndSessionId(id, this.sessionId);
      if (!session) {
        throw new Error(`Session not found: ${this.sessionId}`);
      }
      return JSON.parse(session.getData, BufferJSON.reviver);
    } catch (error) {
      console.log(error);
    }
  }

  private async del(id: string) {
    try {
      id = this.fixId(id);
      await this.sessionRepository.deleteByIdAndSessionId(id, this.sessionId);
    } catch (error) {
      console.log(error);
    }
  }

  private fixId(id: string) {
    return id.replace(/\//g, '__').replace(/:/g, '-').replace(/\./g, '--');
  }
}
