import { EnvironmentConfigs } from '../../application/configs/environment-configs';
import { ClusterEventsListener } from '../cluster/cluster-events-listener';

export class ClusterWorker {
  async init() {
    console.log('Cluster started');
    EnvironmentConfigs.loadEnvironmentVariables();
    process.on('message', ClusterEventsListener.listen);
  }
}
