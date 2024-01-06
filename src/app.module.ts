import { Module } from '@nestjs/common';
import { BaileysModule } from './infra/libs/baileys/baileys.module';
import { AppController } from './app.controller';

@Module({
  imports: [BaileysModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
