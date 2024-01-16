import { Module } from '@nestjs/common';
import { BaileysModule } from './infra/libs/baileys/baileys.module';
import { UserModule } from './infra/modules/user.module';
import { AuthenticationModule } from './infra/modules/authentication.module';
import { LogsModule } from './infra/modules/logs.module';
import { HttpLogger } from './application/core/interfaces/logging/http-logger';
import { DatabaseHttpLogger } from './infra/logging/database-http-logger';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './infra/filters/global-exception-filter';
import { AuthModule } from './infra/modules/auth.module';

@Module({
  imports: [
    LogsModule,
    AuthModule,
    BaileysModule,
    UserModule,
    AuthenticationModule,
  ],
  providers: [
    {
      provide: HttpLogger,
      useClass: DatabaseHttpLogger,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
