import { Module } from '@nestjs/common';
import { CreateUserController } from 'src/presentation/controllers/create-user-controller';
import { CreateUserUseCase } from 'src/application/use-cases/user/create-user-use-case';
import { PrismaModule } from '../database/prisma/prisma.module';
import { BcryptPasswordEncrypter } from '../libs/bcrypt/bcrypt-password-encrypter';
import { PasswordEncrypter } from 'src/application/core/interfaces/cryptography/password-encrypter';
import { AuthModule } from './auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CreateUserController],
  providers: [
    CreateUserUseCase,
    {
      provide: PasswordEncrypter,
      useClass: BcryptPasswordEncrypter,
    },
  ],
})
export class UserModule {}
