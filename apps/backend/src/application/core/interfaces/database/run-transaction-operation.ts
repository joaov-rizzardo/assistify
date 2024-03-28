export abstract class RunTransactionOperation {
  abstract execute<T>(callback: () => Promise<T> | T): Promise<T> | T;
}
