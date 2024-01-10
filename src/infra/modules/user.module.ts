import { Module } from '@nestjs/common';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { CreateUserController } from 'src/presentation/controllers/create-user-controller';
import { PrismaUserRepository } from '../database/prisma/repositories/prisma-user-repository';
import { CreateUserUseCase } from 'src/application/use-cases/user/create-user-use-case';
import { PrismaModule } from '../database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CreateUserController],
  providers: [
    CreateUserUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
