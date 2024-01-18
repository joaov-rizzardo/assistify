import { RunTransactionOperation } from 'src/application/core/interfaces/database/run-transaction-operation';
import { PrismaProvider } from './prisma-provider';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaTransactionOperation implements RunTransactionOperation {
  constructor(private readonly prisma: PrismaProvider) {}

  async execute<T>(callback: () => T | Promise<T>): Promise<T> {
    return this.prisma.transactionContext.$transaction(async (prisma) => {
      this.prisma.startTransactionContext(prisma as PrismaClient);
      const response = await callback();
      this.prisma.resetTransactionContext();
      return response;
    });
  }
}
