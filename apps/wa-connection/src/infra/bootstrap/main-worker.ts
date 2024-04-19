import { Worker } from 'cluster';
import { FastifyServer } from './fastify-server';
import { ClusterBalancer } from '../cluster/cluster-balancer';

export class MainWorker {
  static async init(workers: Worker[]) {
    ClusterBalancer.init(workers);
    FastifyServer.init();
  }
}
