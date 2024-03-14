import {
  UserNotificationContentType,
  UserNotificationTypes,
} from '../../entities/schemas/user-notification-schema';
import { UserNotification } from '../../entities/user-notification';

export type CreateUserNotificationArgs = {
  userId: string;
  type: UserNotificationTypes;
  content?: UserNotificationContentType;
};

export type FindNotificationArgs = {
  userId: string;
  type?: UserNotificationTypes;
};

export type UpdateUserNotificationArgs = {
  date?: Date;
  content?: UserNotificationContentType;
};

export abstract class UserNotificationRepository {
  abstract create(
    args: CreateUserNotificationArgs,
  ): UserNotification | Promise<UserNotification>;

  abstract find(
    args: FindNotificationArgs,
  ): UserNotification[] | Promise<UserNotification[]>;

  abstract findById(
    notificationId: string,
  ): UserNotification | null | Promise<UserNotification | null>;

  abstract findWorkspaceInvite(
    userId: string,
    workspaceId: string,
  ): UserNotification | null | Promise<UserNotification | null>;

  abstract read(
    notificationId: string,
  ): null | UserNotification | Promise<UserNotification | null>;

  abstract update(
    notificationId: string,
    args: UpdateUserNotificationArgs,
  ): null | UserNotification | Promise<UserNotification | null>;

  abstract findUserUnreadNotifications(
    userId: string,
  ): Promise<UserNotification[]> | UserNotification[];
}
