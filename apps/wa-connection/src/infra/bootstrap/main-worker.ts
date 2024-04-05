import { Worker } from 'cluster';

export class MainWorker {
  private static workers: Worker[] = [];

  static async init(workers: Worker[]) {
    this.workers = workers;
    console.log(this.workers);
  }
}
