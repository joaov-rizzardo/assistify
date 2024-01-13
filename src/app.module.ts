import { Module } from '@nestjs/common';
import { BaileysModule } from './infra/libs/baileys/baileys.module';
import { AppController } from './app.controller';
import { UserModule } from './infra/modules/user.module';
import { AuthenticationModule } from './infra/modules/authentication.module';

@Module({
  imports: [BaileysModule, UserModule, AuthenticationModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
