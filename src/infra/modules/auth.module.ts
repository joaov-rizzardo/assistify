import { Module, Global } from '@nestjs/common';
import { TokenGenerator } from 'src/application/core/interfaces/tokens/token-generator';
import { JwtTokenGenerator } from '../libs/jwt/jwt-token-generator';
import { UserAuthenticationGuard } from '../guards/user-authentication.guard';
@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    UserAuthenticationGuard,
    {
      provide: TokenGenerator,
      useClass: JwtTokenGenerator,
    },
  ],
  exports: [TokenGenerator],
})
export class AuthModule {}
