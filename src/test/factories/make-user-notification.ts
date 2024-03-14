import { Injectable } from '@nestjs/common';
import {
  UserNotificationContentType,
  UserNotificationTypes,
} from 'src/application/core/entities/schemas/user-notification-schema';
import { UserNotification } from 'src/application/core/entities/user-notification';
import { PrismaProvider } from 'src/infra/database/prisma/prisma-provider';

type CreateUserNotificationArgs = {
  type: UserNotificationTypes;
  content?: UserNotificationContentType;
  read: boolean;
};
@Injectable()
export class UserNotificationFactory {
  constructor(private prisma: PrismaProvider) {}

  async makeUserNotification(userId: string, args: CreateUserNotificationArgs) {
    const notification = await this.prisma.client.userNotifications.create({
      data: {
        type: args.type,
        content: args.content,
        read: args.read,
        user_id: userId,
      },
    });
    return new UserNotification({
      id: notification.id,
      createdAt: notification.created_at,
      date: notification.date,
      read: notification.read,
      type: notification.type,
      updatedAt: notification.updated_at,
      userId: notification.user_id,
      content: notification.content as UserNotificationContentType,
    });
  }
}
