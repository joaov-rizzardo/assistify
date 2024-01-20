import { Module, Global } from '@nestjs/common';
import { TokenGenerator } from 'src/application/core/interfaces/tokens/token-generator';
import { JwtTokenGenerator } from '../libs/jwt/jwt-token-generator';
import { UserAuthenticationGuard } from '../guards/user-authentication.guard';
import { WorkspaceAuthenticationGuard } from '../guards/workspace-authentication.guard';
import { PrismaModule } from '../database/prisma/prisma.module';
@Global()
@Module({
  imports: [PrismaModule.forAuth()],
  controllers: [],
  providers: [
    UserAuthenticationGuard,
    WorkspaceAuthenticationGuard,
    {
      provide: TokenGenerator,
      useClass: JwtTokenGenerator,
    },
  ],
  exports: [
    TokenGenerator,
    PrismaModule,
    UserAuthenticationGuard,
    WorkspaceAuthenticationGuard,
  ],
})
export class AuthModule {}
