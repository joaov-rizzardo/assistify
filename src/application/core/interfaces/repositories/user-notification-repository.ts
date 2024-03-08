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

export abstract class UserNotificationRepository {
  abstract create(
    args: CreateUserNotificationArgs,
  ): UserNotification | Promise<UserNotification>;

  abstract find(
    args: FindNotificationArgs,
  ): UserNotification[] | Promise<UserNotification[]>;
}
