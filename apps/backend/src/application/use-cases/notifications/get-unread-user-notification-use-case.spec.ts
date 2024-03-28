import { UserNotificationRepository } from 'src/application/core/interfaces/repositories/user-notification-repository';
import { GetUnreadUserNotificationsUseCase } from './get-unread-user-notifications-use-case';
import { InMemoryUserNotificationRepository } from 'src/test/repositories/in-memory-user-notification-repository';
import { v4 as uuid } from 'uuid';
import { UserNotification } from 'src/application/core/entities/user-notification';

describe('Get unread user notifications use case', () => {
  let userNotificationRepository: UserNotificationRepository;
  let userId: string;
  let sut: GetUnreadUserNotificationsUseCase;
  let notification: UserNotification;

  beforeEach(async () => {
    userNotificationRepository = new InMemoryUserNotificationRepository();
    sut = new GetUnreadUserNotificationsUseCase(userNotificationRepository);
    userId = uuid();
    notification = await userNotificationRepository.create({
      type: 'workspace_invite',
      userId
    });
  });

  it('should return user unread notifications', async () => {
    const result = await sut.execute(userId);
    expect(result).toEqual([notification]);
  });

  it("shoudn't return read notifications", async () => {
    await userNotificationRepository.read(notification.getId());
    const result = await sut.execute(userId);
    expect(result.length).toBe(0);
  });
});
