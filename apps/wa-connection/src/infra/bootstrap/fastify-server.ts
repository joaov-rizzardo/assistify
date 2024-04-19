import fastify, { FastifyInstance } from 'fastify';

export class FastifyServer {
  static server: FastifyInstance;
  static async init() {
    this.server = fastify();
    this.server.listen({
      port: 3010
    });
  }

  static initRoutes() {
    this.server.get('/ping', async () => {
      return 'pong';
    });
  }
}
