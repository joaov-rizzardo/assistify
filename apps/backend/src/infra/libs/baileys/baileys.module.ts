// import { Module } from '@nestjs/common';
// import { PrismaModule } from 'src/infra/database/prisma/prisma.module';
// import { PrismaBaileysSessionRepository } from 'src/infra/database/prisma/repositories/prisma-baileys-session-repository';
// import { BaileysSessionRepository } from './repositories/baileys-session-repository';
// import { BaileysConnections } from './baileys-connections';

// @Module({
//   imports: [PrismaModule],
//   controllers: [],
//   providers: [
//     {
//       provide: BaileysSessionRepository,
//       useClass: PrismaBaileysSessionRepository
//     },
//     BaileysConnections
//   ],
//   exports: [BaileysConnections]
// })
// export class BaileysModule {}
