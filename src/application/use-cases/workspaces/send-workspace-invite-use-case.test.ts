import { v4 as uuid } from 'uuid';
import { SendWorkspaceInviteUseCase } from './send-workspace-invite-use-case';
import { AbstractUserSocketEmitter } from 'src/application/core/interfaces/socket/abstract-user-socket-emitter';
import { UserNotificationRepository } from 'src/application/core/interfaces/repositories/user-notification-repository';
import { InMemoryUserNotificationRepository } from 'src/test/repositories/in-memory-user-notification-repository';
import { FakeUserSocketEmitter } from 'src/test/socket/fake-user-socket-emitter';

describe('Remove workspace member use case', () => {
  let userNotificationRepository: UserNotificationRepository;
  let socket: AbstractUserSocketEmitter;
  let sut: SendWorkspaceInviteUseCase;

  beforeEach(async () => {
    userNotificationRepository = new InMemoryUserNotificationRepository();
    socket = new FakeUserSocketEmitter();
    sut = new SendWorkspaceInviteUseCase(socket, userNotificationRepository);
  });

  it('it should create create workspace invite', async () => {
    const userId = uuid();
    const workspaceId = uuid();
    const invitingUserId = uuid();
    const notification = await sut.execute({
      invitingUserId,
      userId,
      workspaceId,
    });
    expect(notification).toBeTruthy();
  });

  it('it should emit event on user socket', async () => {
    const userId = uuid();
    const workspaceId = uuid();
    const invitingUserId = uuid();
    await sut.execute({
      invitingUserId,
      userId,
      workspaceId,
    });
    expect(socket.sendToUser).toHaveBeenCalled();
  });
});
