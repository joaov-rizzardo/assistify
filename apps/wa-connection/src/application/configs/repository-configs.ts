import { PrismaBaileysSessionRepository } from '../../infra/libs/prisma/repositories/prisma-baileys-session-repository';
import { BaileysSessionRepository } from '../core/interfaces/repositories/baileys-session-repository';

export class RepositoryConfigs {
  private static instances: Map<string, unknown> = new Map();

  private static mapping = new Map<string, new (...args: unknown[]) => unknown>([[BaileysSessionRepository.name, PrismaBaileysSessionRepository]]);

  static getRepositoryInstance<T>(constructor: abstract new () => T): T {
    const name = constructor.name;
    if (!this.instances.has(name)) {
      const constructor = this.mapping.get(name);
      if (!constructor) throw new Error(name);
      this.instances.set(name, new constructor());
    }
    return this.instances.get(name) as T;
  }
}
