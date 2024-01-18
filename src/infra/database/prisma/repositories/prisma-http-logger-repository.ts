import {
  HttpLoggerRepository,
  SaveLogParams,
} from 'src/infra/logging/repositories/http-logger-repository';
import { PrismaProvider } from '../prisma-provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaHttpLoggerRepository implements HttpLoggerRepository {
  constructor(private readonly prisma: PrismaProvider) {}
  async save(args: SaveLogParams): Promise<void> {
    await this.prisma.client.httpLogs.create({
      data: {
        httpCode: args.httpCode,
        level: args.level,
        message: args.message,
        route: args.route,
        userId: args.userId,
        body: args.body,
        stack: args.stack,
        method: args.method,
      },
    });
  }
}
