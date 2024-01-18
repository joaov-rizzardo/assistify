import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as cls from 'cls-hooked';

const PRISMA_CLIENT_KEY = 'PRIMA_CLIENT_KEY';

@Injectable()
export class PrismaProvider implements OnModuleInit {
  private readonly prismaClient: PrismaClient;
  private readonly transactionContext: cls.Namespace;

  constructor() {
    this.prismaClient = new PrismaClient();
    this.transactionContext = cls.createNamespace('transactions');
  }

  public get client() {
    return this.transactionContext.get(PRISMA_CLIENT_KEY) || this.prismaClient;
  }

  public startTransactionContext(prisma: PrismaClient) {
    this.transactionContext.set(PRISMA_CLIENT_KEY, prisma);
  }

  public resetTransactionContext() {
    this.transactionContext.set(PRISMA_CLIENT_KEY, null);
  }

  async onModuleInit() {
    await this.prismaClient.$connect();
  }
}
