import { Module } from '@nestjs/common';
import { CreateUserUseCase } from 'src/application/use-cases/user/create-user-use-case';
import { PrismaModule } from '../database/prisma/prisma.module';
import { BcryptPasswordEncrypter } from '../libs/bcrypt/bcrypt-password-encrypter';
import { PasswordEncrypter } from 'src/application/core/interfaces/cryptography/password-encrypter';
import { AuthModule } from './auth.module';
import { CreateUserController } from 'src/presentation/controllers/user/create-user-controller';
import { GetUserUseCase } from 'src/application/use-cases/user/get-user-use-case';
import { GetUserBasicInfoController } from 'src/presentation/controllers/user/get-user-basic-info-controller';
import { ChangeUserPasswordController } from 'src/presentation/controllers/user/change-user-password-controller';
import { ChangeUserPasswordUseCase } from 'src/application/use-cases/user/change-user-password-use-case';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    CreateUserController,
    GetUserBasicInfoController,
    ChangeUserPasswordController,
  ],
  providers: [
    CreateUserUseCase,
    GetUserUseCase,
    ChangeUserPasswordUseCase,
    {
      provide: PasswordEncrypter,
      useClass: BcryptPasswordEncrypter,
    },
  ],
})
export class UserModule {}
