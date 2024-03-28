import { v4 as uuid } from 'uuid';
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { User } from 'src/application/core/entities/user';
import { TokenGenerator } from 'src/application/core/interfaces/tokens/token-generator';

export function makeToken() {
  return jwt.sign({}, 'FAKE_SECRET', {
    subject: uuid(),
    expiresIn: '7d'
  });
}

@Injectable()
export class TokenFactory {
  constructor(private readonly tokenGenerator: TokenGenerator) {}

  async makeAccessToken(user: User) {
    const accessToken = await this.tokenGenerator.generateAccessToken(user.getId());
    return accessToken;
  }

  async makeRefreshToken(user: User) {
    const refreshToken = await this.tokenGenerator.generateRefreshToken(user.getId());
    return refreshToken;
  }
}
