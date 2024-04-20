import fastify, { FastifyInstance } from 'fastify';
import { ConnectWAController } from '../../presentation/controllers/connect-wa-controller';

export class FastifyServer {
  static server: FastifyInstance;
  static async init() {
    this.server = fastify();
    this.initRoutes();
    this.server.listen({
      port: 3010
    });
  }

  static initRoutes() {
    this.server.get('/connect', ConnectWAController.handle);
  }
}
