import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma/prisma.module';
@Global()
@Module({
  imports: [PrismaModule.forLogs()],
  providers: [],
  exports: [PrismaModule],
})
export class LogsModule {}
