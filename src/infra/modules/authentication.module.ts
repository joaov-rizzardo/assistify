import { Module } from '@nestjs/common';
import { PasswordEncrypter } from 'src/application/core/interfaces/cryptography/password-encrypter';
import { BcryptPasswordEncrypter } from '../libs/bcrypt/bcrypt-password-encrypter';
import { TokenGenerator } from 'src/application/core/interfaces/tokens/token-generator';
import { JwtTokenGenerator } from '../libs/jwt/jwt-token-generator';
import { AuthenticateUserUseCase } from 'src/application/use-cases/authentication/authenticate-user-use-case';
import { RefreshTokenUseCase } from 'src/application/use-cases/authentication/refresh-token-use-case';
import { PrismaModule } from '../database/prisma/prisma.module';
import { AuthenticateUserController } from 'src/presentation/controllers/authentication/authenticate-user-controller';
import { RefreshTokenController } from 'src/presentation/controllers/authentication/refresh-token-controller';

@Module({
  imports: [PrismaModule],
  controllers: [AuthenticateUserController, RefreshTokenController],
  providers: [
    AuthenticateUserUseCase,
    RefreshTokenUseCase,
    {
      provide: PasswordEncrypter,
      useClass: BcryptPasswordEncrypter,
    },
    {
      provide: TokenGenerator,
      useClass: JwtTokenGenerator,
    },
  ],
})
export class AuthenticationModule {}
