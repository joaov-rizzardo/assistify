import { RunTransactionOperation } from 'src/application/core/interfaces/database/run-transaction-operation';

export class FakeTransactionOperation implements RunTransactionOperation {
  execute<T>(callback: () => T | Promise<T>): T | Promise<T> {
    return callback();
  }
}
