import {
  AccessTokenPayload,
  RefreshTokenPayload,
  TokenGenerator,
} from 'src/application/core/interfaces/tokens/token-generator';
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtTokenGenerator implements TokenGenerator {
  private readonly ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  private readonly REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

  generateAccessToken(userId: string): string | Promise<string> {
    return jwt.sign({}, this.ACCESS_TOKEN_SECRET, {
      subject: userId,
      expiresIn: '7d',
    });
  }

  generateRefreshToken(userId: string): string | Promise<string> {
    return jwt.sign({}, this.REFRESH_TOKEN_SECRET, {
      subject: userId,
      expiresIn: '5m',
    });
  }

  checkAccessToken(token: string): boolean | Promise<boolean> {
    try {
      return Boolean(jwt.verify(token, this.ACCESS_TOKEN_SECRET));
    } catch {
      return false;
    }
  }

  checkRefreshToken(token: string): boolean | Promise<boolean> {
    try {
      return Boolean(jwt.verify(token, this.REFRESH_TOKEN_SECRET));
    } catch {
      return false;
    }
  }

  decodeRefreshToken(token: string): RefreshTokenPayload {
    const refreshToken = jwt.decode(token) as jwt.JwtPayload;
    return {
      userId: refreshToken.sub,
    };
  }
  decodeAccessToken(
    token: string,
  ): AccessTokenPayload | Promise<AccessTokenPayload> {
    const accessToken = jwt.decode(token) as jwt.JwtPayload;
    return {
      userId: accessToken.sub,
    };
  }
}
