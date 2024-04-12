import { ClusterEventsListener } from '../cluster/cluster-events-listener';

export class ClusterWorker {
  async init() {
    process.on('message', ClusterEventsListener.listen);
  }
}
