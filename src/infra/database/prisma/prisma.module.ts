import { DynamicModule, Module } from '@nestjs/common';
import { PrismaProvider } from './prisma-provider';
import { PrismaBaileysSessionRepository } from './repositories/prisma-baileys-session-repository';
import { PrismaUserRepository } from './repositories/prisma-user-repository';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { BaileysSessionRepository } from 'src/infra/libs/baileys/repositories/baileys-session-repository';
import { HttpLoggerRepository } from 'src/infra/logging/repositories/http-logger-repository';
import { PrismaHttpLoggerRepository } from './repositories/prisma-http-logger-repository';
import { WorkspaceRepository } from 'src/application/core/interfaces/repositories/workspace-repository';
import { PrismaWorkspaceRepository } from './repositories/prisma-workspace-repository';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { PrismaWorkspaceMembersRepository } from './repositories/prisma-workspace-members-repository';
import { PrismaTransactionOperation } from './prisma-transaction-operation';
import { RunTransactionOperation } from 'src/application/core/interfaces/database/run-transaction-operation';

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
    {
      provide: WorkspaceRepository,
      useClass: PrismaWorkspaceRepository,
    },
    {
      provide: WorkspaceMembersRepository,
      useClass: PrismaWorkspaceMembersRepository,
    },
    {
      provide: RunTransactionOperation,
      useClass: PrismaTransactionOperation,
    },
  ],
  exports: [
    PrismaProvider,
    UserRepository,
    BaileysSessionRepository,
    HttpLoggerRepository,
    WorkspaceRepository,
    WorkspaceMembersRepository,
    RunTransactionOperation,
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
  static forAuth(): DynamicModule {
    return {
      module: PrismaModule,
      providers: [
        {
          provide: WorkspaceMembersRepository,
          useClass: PrismaWorkspaceMembersRepository,
        },
      ],
      exports: [WorkspaceMembersRepository],
    };
  }
}
