import { UserNotification } from 'src/application/core/entities/user-notification';

export class UserNotificationPresenter {
  static toHTTP(notification: UserNotification) {
    return notification.toObject();
  }
}
