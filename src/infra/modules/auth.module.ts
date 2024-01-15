import { Module } from '@nestjs/common';
import { TokenGenerator } from 'src/application/core/interfaces/tokens/token-generator';
import { JwtTokenGenerator } from '../libs/jwt/jwt-token-generator';
import { UserAuthenticationGuard } from '../guards/user-authentication.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: UserAuthenticationGuard,
    },
    {
      provide: TokenGenerator,
      useClass: JwtTokenGenerator,
    },
  ],
  exports: [TokenGenerator],
})
export class AuthModule {}
