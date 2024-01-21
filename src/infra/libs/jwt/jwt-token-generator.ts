import {
  AccessTokenPayload,
  RefreshTokenPayload,
  TokenGenerator,
} from 'src/application/core/interfaces/tokens/token-generator';
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { getEnvVariable } from 'src/infra/configs/env-config';

const EXPIRES_IN_FIVE_MINUTES = 60 * 5;
const EXPIRES_IN_ONE_WEEK = 60 * 60 * 24 * 7;

@Injectable()
export class JwtTokenGenerator implements TokenGenerator {
  private readonly ACCESS_TOKEN_SECRET = getEnvVariable('ACCESS_TOKEN_SECRET');
  private readonly REFRESH_TOKEN_SECRET = getEnvVariable(
    'REFRESH_TOKEN_SECRET',
  );

  generateAccessToken(userId: string): string | Promise<string> {
    return jwt.sign({}, this.ACCESS_TOKEN_SECRET, {
      subject: userId,
      expiresIn: EXPIRES_IN_FIVE_MINUTES,
    });
  }

  generateRefreshToken(userId: string): string | Promise<string> {
    return jwt.sign({}, this.REFRESH_TOKEN_SECRET, {
      subject: userId,
      expiresIn: EXPIRES_IN_ONE_WEEK,
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
