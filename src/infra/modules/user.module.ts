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
import { UpdateUserController } from 'src/presentation/controllers/user/update-user-controller';
import { UpdateUserUseCase } from 'src/application/use-cases/user/update-user-use-case';
import { StorageModule } from './storage.module';

@Module({
  imports: [PrismaModule, AuthModule, StorageModule],
  controllers: [
    CreateUserController,
    GetUserBasicInfoController,
    ChangeUserPasswordController,
    UpdateUserController,
  ],
  providers: [
    CreateUserUseCase,
    GetUserUseCase,
    ChangeUserPasswordUseCase,
    UpdateUserUseCase,
    {
      provide: PasswordEncrypter,
      useClass: BcryptPasswordEncrypter,
    },
  ],
})
export class UserModule {}
