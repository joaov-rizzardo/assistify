import { UserNotification } from 'src/application/core/entities/user-notification';
import {
  CreateUserNotificationArgs,
  FindNotificationArgs,
  UserNotificationRepository,
} from 'src/application/core/interfaces/repositories/user-notification-repository';
import { v4 as uuid } from 'uuid';

export class InMemoryUserNotificationRepository
  implements UserNotificationRepository
{
  notifications: UserNotification[] = [];

  create(args: CreateUserNotificationArgs): UserNotification {
    const notification = new UserNotification({
      id: uuid(),
      userId: args.userId,
      createdAt: new Date(),
      date: new Date(),
      read: false,
      type: 'workspace_invite',
      updatedAt: new Date(),
      content: args.content,
    });
    this.notifications.push(notification);
    return notification;
  }

  find(args: FindNotificationArgs): UserNotification[] {
    return this.notifications.filter((notification) => {
      if (notification.getUserId() !== args.userId) return false;
      if (args.type && args.type !== notification.getType()) return false;
      return true;
    });
  }

  read(notificationId: string): null | UserNotification {
    const notification = this.notifications.find(
      (notification) => notification.getId() === notificationId,
    );
    if (!notification) return null;
    const updatedNotification = new UserNotification({
      ...notification.toObject(),
      read: true,
    });
    this.notifications = this.notifications.map((n) => {
      if (n.getId() === notificationId) return updatedNotification;
      return n;
    });
    return updatedNotification;
  }
}
