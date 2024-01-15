import { DynamicModule, Module } from '@nestjs/common';
import { PrismaProvider } from './prisma-provider';
import { PrismaBaileysSessionRepository } from './repositories/prisma-baileys-session-repository';
import { PrismaUserRepository } from './repositories/prisma-user-repository';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { BaileysSessionRepository } from 'src/infra/libs/baileys/repositories/baileys-session-repository';
import { HttpLoggerRepository } from 'src/infra/logging/repositories/http-logger-repository';
import { PrismaHttpLoggerRepository } from './repositories/prisma-http-logger-repository';

@Module({
  imports: [],
  providers: [
    PrismaProvider,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: BaileysSessionRepository,
      useClass: PrismaBaileysSessionRepository,
    },
    {
      provide: HttpLoggerRepository,
      useClass: PrismaHttpLoggerRepository,
    },
  ],
  exports: [
    PrismaProvider,
    UserRepository,
    BaileysSessionRepository,
    HttpLoggerRepository,
  ],
})
export class PrismaModule {
  static forLogs(): DynamicModule {
    return {
      module: PrismaModule,
      providers: [
        {
          provide: HttpLoggerRepository,
          useClass: PrismaHttpLoggerRepository,
        },
      ],
      exports: [HttpLoggerRepository],
    };
  }
}
