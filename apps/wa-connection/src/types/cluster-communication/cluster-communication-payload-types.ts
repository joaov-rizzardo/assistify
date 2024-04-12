export type MakeConnectionPayload = undefined;

export type ClusterMessagePayload = {
  make_connection: MakeConnectionPayload;
};

export type ClusterMessagePayloadKeys = keyof ClusterMessagePayload;

export type ClusterMessageBody<T extends ClusterMessagePayloadKeys> = {
  id: string;
  type: T;
  data: ClusterMessagePayload[T];
};
