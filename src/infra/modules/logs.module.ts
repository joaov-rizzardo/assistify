import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma/prisma.module';

@Module({})
export class LogsModule {
  static forRoot() {
    return {
      module: LogsModule,
      imports: [PrismaModule.forLogs()],
      providers: [],
      exports: [PrismaModule],
    };
  }
}
