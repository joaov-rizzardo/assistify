import { Worker } from 'cluster';

export class WorkersBalancer {
  private static workers: Worker[] = [];

  static init(workers: Worker[]) {
    this.workers = workers;
  }

  static getWorker() {
    return this.workers[Math.floor(Math.random() * this.workers.length)];
  }
}
