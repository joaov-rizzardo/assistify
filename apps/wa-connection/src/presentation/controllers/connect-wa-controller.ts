import { FastifyRequest, FastifyReply } from 'fastify';
import { ClusterBalancer } from '../../infra/cluster/cluster-balancer';
import { ClusterCommunication } from '../../infra/cluster/cluster-communication';
export class ConnectWAController {
  static async handle(_: FastifyRequest, reply: FastifyReply) {
    try {
      const worker = ClusterBalancer.selectLeastLoadedWorker();
      const { qrCode, sessionId } = await ClusterCommunication.send(worker, 'make_connection');
      ClusterBalancer.addSessions(worker.id, sessionId);
      reply.code(200).send({ qrCode, sessionId });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
