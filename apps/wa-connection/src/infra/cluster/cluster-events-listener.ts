import { randomUUID } from 'crypto';
import {
  ClusterMessageBody,
  ClusterMessagePayload,
  ClusterMessagePayloadKeys
} from '../../types/cluster-communication/cluster-communication-payload-types';
import { ClusterResponseType } from '../../types/cluster-communication/cluster-communication-response-types';

export type EventMapFunction<T extends ClusterMessagePayloadKeys> = (message: ClusterMessagePayload[T]) => Promise<ClusterResponseType[T]>;

const eventsMap: Record<ClusterMessagePayloadKeys, EventMapFunction<ClusterMessagePayloadKeys>> = {
  make_connection: async () => {
    return {
      qrCode: 'teste',
      sessionId: randomUUID()
    };
  }
};
export class ClusterEventsListener {
  static async listen(message: ClusterMessageBody<ClusterMessagePayloadKeys>) {
    const event = eventsMap[message.type];
    if (!event) throw new Error('Event not handled');
    const result = await event(message.data);
    process.send &&
      process.send({
        id: message.id,
        data: result
      });
  }
}
