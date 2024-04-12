import { Worker } from 'cluster';
import { randomUUID } from 'crypto';
import { ClusterMessagePayload } from '../../types/cluster-communication/cluster-communication-payload-types';
import { ClusterMessageResponse, ClusterResponseType } from '../../types/cluster-communication/cluster-communication-response-types';

export class ClusterCommunication {
  static async send<T extends keyof ClusterMessagePayload>(
    cluster: Worker,
    type: T,
    data?: ClusterMessagePayload[T]
  ): Promise<ClusterResponseType[T]> {
    const id = randomUUID();
    cluster.send({
      id,
      type,
      data
    });
    return new Promise((resolve) => {
      cluster.on('message', (response: ClusterMessageResponse<T>) => {
        if (response.id === id) {
          resolve(response.data);
        }
      });
    });
  }
}
