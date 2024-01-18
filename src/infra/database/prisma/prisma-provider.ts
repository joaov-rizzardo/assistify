import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaProvider implements OnModuleInit {
  private readonly prismaClient: PrismaClient;
  private _transactionContext: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
    this._transactionContext = this.prismaClient;
  }

  public get transactionContext() {
    return this._transactionContext;
  }

  public startTransactionContext(prisma: PrismaClient) {
    this._transactionContext = prisma;
  }

  public resetTransactionContext() {
    this._transactionContext = this.prismaClient;
  }

  async onModuleInit() {
    await this.prismaClient.$connect();
  }
}
