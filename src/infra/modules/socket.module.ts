import { Module } from '@nestjs/common';
import { SocketGateway } from 'src/presentation/socket/socket-gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [SocketGateway],
})
export class SocketModule {}
