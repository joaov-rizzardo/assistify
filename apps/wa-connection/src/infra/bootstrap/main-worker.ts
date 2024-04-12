import { Worker } from 'cluster';
import { WorkersBalancer } from '../common/workers-balancer';
import { FastifyServer } from './fastify-server';

export class MainWorker {
  static async init(workers: Worker[]) {
    WorkersBalancer.init(workers);
    FastifyServer.init();
  }
}
