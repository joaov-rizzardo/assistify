import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@assistify/prisma';
import { ClsService } from 'nestjs-cls';

const PRISMA_CLIENT_KEY = 'PRIMA_CLIENT_KEY';

@Injectable()
export class PrismaProvider implements OnModuleInit {
  private readonly prismaClient: PrismaClient;

  constructor(private readonly cls: ClsService) {
    this.prismaClient = new PrismaClient();
  }

  public get client(): PrismaClient {
    return this.cls.get(PRISMA_CLIENT_KEY) || this.prismaClient;
  }

  public startTransactionContext(prisma: PrismaClient) {
    this.cls.set(PRISMA_CLIENT_KEY, prisma);
  }

  public resetTransactionContext() {
    this.cls.set(PRISMA_CLIENT_KEY, null);
  }

  async onModuleInit() {
    await this.prismaClient.$connect();
  }
}
