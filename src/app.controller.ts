import { Controller, Get } from '@nestjs/common';
import { BaileysConnections } from './infra/libs/baileys/baileys-connections';

@Controller()
export class AppController {
  constructor(private readonly baileysConnections: BaileysConnections) {}

  @Get()
  async getHello() {
    await this.baileysConnections.connect({});
    return 'asdasd';
  }
}
