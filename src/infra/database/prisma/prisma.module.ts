import { Module } from '@nestjs/common';
import { PrismaProvider } from './prisma-provider';
import { PrismaBaileysSessionRepository } from './repositories/prisma-baileys-session-repository';

@Module({
  imports: [],
  providers: [PrismaProvider, PrismaBaileysSessionRepository],
  exports: [PrismaProvider],
})
export class PrismaModule {}
