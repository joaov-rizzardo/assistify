import { Module } from '@nestjs/common';
import { BaileysModule } from './infra/libs/baileys/baileys.module';
import { AppController } from './app.controller';
import { UserModule } from './infra/modules/user.module';

@Module({
  imports: [BaileysModule, UserModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
