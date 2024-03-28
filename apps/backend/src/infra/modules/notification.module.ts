import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma/prisma.module';
import { GetUnreadUserNotificationsUseCase } from 'src/application/use-cases/notifications/get-unread-user-notifications-use-case';
import { GetUserUnreadNotificationsController } from 'src/presentation/controllers/notification/get-user-unread-notifications-controller';
@Module({
  imports: [PrismaModule],
  controllers: [GetUserUnreadNotificationsController],
  providers: [GetUnreadUserNotificationsUseCase],
  exports: []
})
export class NotificationModule {}
