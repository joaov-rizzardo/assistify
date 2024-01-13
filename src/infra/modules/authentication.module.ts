import { Module } from '@nestjs/common';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { AuthenticateUserController } from 'src/presentation/controllers/authenticate-user-controller';
import { PrismaUserRepository } from '../database/prisma/repositories/prisma-user-repository';
import { PasswordEncrypter } from 'src/application/core/interfaces/cryptography/password-encrypter';
import { BcryptPasswordEncrypter } from '../libs/bcrypt/bcrypt-password-encrypter';
import { TokenGenerator } from 'src/application/core/interfaces/tokens/token-generator';
import { JwtTokenGenerator } from '../libs/jwt/jwt-token-generator';
import { AuthenticateUserUseCase } from 'src/application/use-cases/authentication/authenticate-user-use-case';
import { RefreshTokenUseCase } from 'src/application/use-cases/authentication/refresh-token-use-case';
import { RefreshTokenController } from 'src/presentation/controllers/refresh-token-controller';
import { PrismaModule } from '../database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuthenticateUserController, RefreshTokenController],
  providers: [
    AuthenticateUserUseCase,
    RefreshTokenUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
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
