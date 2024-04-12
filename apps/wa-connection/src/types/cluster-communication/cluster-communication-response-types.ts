export type MakeConnectionResponse = {
  sessionId: string;
  qrCode: string;
};

export type ClusterResponseType = {
  make_connection: MakeConnectionResponse;
};

export type ClusterMessageResponse<T extends keyof ClusterResponseType> = {
  id: string;
  data: ClusterResponseType[T];
};
