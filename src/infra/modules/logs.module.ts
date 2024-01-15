import { Module } from '@nestjs/common';
import { HttpLoggerRepository } from '../logging/repositories/http-logger-repository';
import { PrismaHttpLoggerRepository } from '../database/prisma/repositories/prisma-http-logger-repository';
import { PrismaModule } from '../database/prisma/prisma.module';

@Module({})
export class LogsModule {
  static forRoot() {
    return {
      module: LogsModule,
      imports: [PrismaModule],
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
