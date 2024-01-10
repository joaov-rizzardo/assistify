import { Module } from '@nestjs/common';
import { PrismaProvider } from './prisma-provider';
import { PrismaBaileysSessionRepository } from './repositories/prisma-baileys-session-repository';
import { PrismaUserRepository } from './repositories/prisma-user-repository';

@Module({
  imports: [],
  providers: [
    PrismaProvider,
    PrismaBaileysSessionRepository,
    PrismaUserRepository,
  ],
  exports: [PrismaProvider],
})
export class PrismaModule {}
