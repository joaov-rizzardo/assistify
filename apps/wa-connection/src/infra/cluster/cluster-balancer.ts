import { Worker } from 'cluster';

export class ClusterBalancer {
  private static workers: Map<number, Worker> = new Map();
  private static sessions: Map<string, number> = new Map();

  static init(workers: Worker[]) {
    workers.forEach((worker) => this.workers.set(worker.id, worker));
  }

  static addSessions(worker: number, sessions: string | string[]) {
    if (typeof sessions === 'string') {
      this.sessions.set(sessions, worker);
      return;
    }
    sessions.forEach((session) => this.sessions.set(session, worker));
  }

  static getWorkerBySessionId(sessionId: string): Worker | null {
    const workerId = this.sessions.get(sessionId);
    if (!workerId) return null;
    return this.workers.get(workerId) || null;
  }

  static selectLeastLoadedWorker(): Worker {
    const sessionsPerWorker = this.calculateWorkersSessions();
    let minValue = 0;
    let workerId: number | null = null;
    for (const [key, value] of Object.entries(sessionsPerWorker)) {
      if (!workerId || value < minValue) {
        minValue = value;
        workerId = Number(key);
      }
    }
    return this.workers.get(workerId!) as Worker;
  }

  private static calculateWorkersSessions() {
    const workers = [...this.sessions.values()];
    const sessionsPerWorker: Record<number, number> = {};
    workers.forEach((item) => {
      if (sessionsPerWorker[item]) {
        sessionsPerWorker[item] += 1;
      } else {
        sessionsPerWorker[item] = 1;
      }
    });
    return sessionsPerWorker;
  }
}
