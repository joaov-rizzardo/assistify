export type RefreshTokenPayload = {
  userId: string;
};

export type AccessTokenPayload = {
  userId: string;
};

export abstract class TokenGenerator {
  abstract generateAccessToken(userId: string): Promise<string> | string;
  abstract generateRefreshToken(userId: string): Promise<string> | string;
  abstract checkAccessToken(token: string): Promise<boolean> | boolean;
  abstract checkRefreshToken(token: string): Promise<boolean> | boolean;
  abstract decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload> | RefreshTokenPayload;
  abstract decodeAccessToken(
    token: string,
  ): Promise<AccessTokenPayload> | AccessTokenPayload;
}
