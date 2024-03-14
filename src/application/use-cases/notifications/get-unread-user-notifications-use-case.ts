import { Injectable } from '@nestjs/common';
import { UserNotification } from 'src/application/core/entities/user-notification';
import { UserNotificationRepository } from 'src/application/core/interfaces/repositories/user-notification-repository';

@Injectable()
export class GetUnreadUserNotificationsUseCase {
  constructor(
    private readonly userNotificationRepository: UserNotificationRepository,
  ) {}

  async execute(userId: string): Promise<UserNotification[]> {
    const notifications =
      await this.userNotificationRepository.findUserUnreadNotifications(userId);
    return notifications;
  }
}
