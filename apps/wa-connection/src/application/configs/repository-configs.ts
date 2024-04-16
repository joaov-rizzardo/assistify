import { PrismaBaileysSessionRepository } from '../../infra/libs/prisma/repositories/prisma-baileys-session-repository';
import { Repository } from '../core/interfaces/repositories/repository';
import { BaileysSessionRepository } from '../core/interfaces/repositories/baileys-session-repository';

export class RepositoryConfigs {
  private static instances: Map<string, Repository> = new Map();
  private static mapping = new Map<string, new () => Repository>([[BaileysSessionRepository.name, PrismaBaileysSessionRepository]]);

  static getRepositoryInstance<T extends abstract new () => Repository>(constructor: T): InstanceType<T> {
    const name = constructor.name;
    if (!this.instances.has(name)) {
      const RepoConstructor = this.mapping.get(name);
      if (!RepoConstructor) throw new Error(`Repository constructor not found for ${name}`);
      this.instances.set(name, new RepoConstructor());
    }
    return this.instances.get(name) as InstanceType<T>;
  }
}
