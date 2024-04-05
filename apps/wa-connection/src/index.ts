import cluster, { Worker } from 'cluster';
import os from 'os';
import { MainWorker } from './infra/bootstrap/main-worker';
import { ClusterWorker } from './infra/bootstrap/cluster-worker';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  const clusters: Worker[] = [];
  for (let i = 0; i < numCPUs; i++) {
    clusters.push(cluster.fork());
  }
  MainWorker.init(clusters);
}

if (cluster.isWorker) {
  const worker = new ClusterWorker();
  worker.init();
}
