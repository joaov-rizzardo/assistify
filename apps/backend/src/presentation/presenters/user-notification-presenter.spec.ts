import { v4 as uuid } from 'uuid';
import { UserNotification } from 'src/application/core/entities/user-notification';
import { UserNotificationPresenter } from './user-notification-presenter';

describe('User notification presenter', () => {
  let notification: UserNotification;

  beforeEach(() => {
    notification = new UserNotification({
      id: uuid(),
      read: false,
      date: new Date(),
      createdAt: new Date(),
      type: 'workspace_invite',
      updatedAt: new Date(),
      userId: uuid(),
      content: {
        invitingUserId: uuid(),
        type: 'workspace_invite',
        workspaceId: uuid()
      }
    });
  });
  it('should present workspace member to http', () => {
    const result = UserNotificationPresenter.toHTTP(notification);
    expect(result.id).toBe(notification.getId());
    expect(result.userId).toBe(notification.getUserId());
    expect(result.read).toBe(notification.getRead());
    expect(result.date).toBe(notification.getDate());
    expect(result.type).toBe(notification.getType());
    expect(result.createdAt).toBe(notification.getCreatedAt());
    expect(result.updatedAt).toBe(notification.getUpdatedAt());
    expect(result.content).toBe(notification.getContent());
  });
});
