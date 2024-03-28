import { Module } from '@nestjs/common';
import { AbstractUserSocketEmitter } from 'src/application/core/interfaces/socket/abstract-user-socket-emitter';
import { UserSocketEmitter } from 'src/presentation/socket/emitters/user-socket-emitter';
import { UserSocketGateway } from 'src/presentation/socket/user-socket-gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [
    UserSocketGateway,
    {
      provide: AbstractUserSocketEmitter,
      useClass: UserSocketEmitter
    }
  ],
  exports: [AbstractUserSocketEmitter]
})
export class SocketModule {}
