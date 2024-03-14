import { UserNotification } from 'src/application/core/entities/user-notification';
import {
  CreateUserNotificationArgs,
  FindNotificationArgs,
  UpdateUserNotificationArgs,
  UserNotificationRepository,
} from 'src/application/core/interfaces/repositories/user-notification-repository';
import { PrismaProvider } from '../prisma-provider';
import { UserNotificationContentType } from 'src/application/core/entities/schemas/user-notification-schema';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type PrismaNotification = Prisma.UserNotificationsGetPayload<{
  include: {
    user: false;
  };
}>;

@Injectable()
export class PrismaUserNotificationRepository
  implements UserNotificationRepository
{
  constructor(private readonly prisma: PrismaProvider) {}

  async create({
    type,
    userId,
    content,
  }: CreateUserNotificationArgs): Promise<UserNotification> {
    const result = await this.prisma.client.userNotifications.create({
      data: {
        type,
        user_id: userId,
        content,
      },
    });
    return this.instanceUserNotificationByReturnQuery(result);
  }

  async find(args: FindNotificationArgs): Promise<UserNotification[]> {
    const notifications = await this.prisma.client.userNotifications.findMany({
      where: {
        user_id: args.userId,
        type: args.type,
      },
    });
    return notifications.map((notification) =>
      this.instanceUserNotificationByReturnQuery(notification),
    );
  }

  async findById(notificationId: string): Promise<UserNotification | null> {
    const notification = await this.prisma.client.userNotifications.findUnique({
      where: {
        id: notificationId,
      },
    });
    if (!notification) return null;
    return this.instanceUserNotificationByReturnQuery(notification);
  }

  async findWorkspaceInvite(
    userId: string,
    workspaceId: string,
  ): Promise<UserNotification | null> {
    const notification = await this.prisma.client.userNotifications.findFirst({
      where: {
        user_id: userId,
        type: 'workspace_invite',
        content: {
          equals: {
            workspaceId,
          },
        },
      },
    });
    if (!notification) return null;
    return this.instanceUserNotificationByReturnQuery(notification);
  }
  async read(notificationId: string): Promise<UserNotification | null> {
    const notification = await this.prisma.client.userNotifications.update({
      data: {
        read: true,
      },
      where: {
        id: notificationId,
      },
    });
    if (!notification) return null;
    return this.instanceUserNotificationByReturnQuery(notification);
  }
  async update(
    notificationId: string,
    args: UpdateUserNotificationArgs,
  ): Promise<UserNotification | null> {
    const notification = await this.prisma.client.userNotifications.update({
      data: {
        ...args,
      },
      where: {
        id: notificationId,
      },
    });
    if (!notification) return null;
    return this.instanceUserNotificationByReturnQuery(notification);
  }

  private instanceUserNotificationByReturnQuery(
    notification: PrismaNotification,
  ) {
    return new UserNotification({
      id: notification.id,
      userId: notification.user_id,
      type: notification.type,
      content: notification.content as UserNotificationContentType,
      read: notification.read,
      date: notification.date,
      createdAt: notification.created_at,
      updatedAt: notification.updated_at,
    });
  }
}
