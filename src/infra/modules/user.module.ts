import { Module } from '@nestjs/common';
import { CreateUserController } from 'src/presentation/controllers/create-user-controller';

@Module({
  imports: [],
  controllers: [CreateUserController],
  providers: [],
})
export class UserModule {}
