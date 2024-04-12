import fastify, { FastifyInstance } from 'fastify';
import { WorkersBalancer } from '../common/workers-balancer';
import { ClusterCommunication } from '../cluster/cluster-communication';

export class FastifyServer {
  static server: FastifyInstance;
  static async init() {
    this.server = fastify();
    this.server.all('*', async (_, reply) => {
      const worker = WorkersBalancer.getWorker();
      const response = await ClusterCommunication.send(worker, 'make_connection');
      reply.send(response);
    });
    this.server.listen({
      port: 3010
    });
  }
}
