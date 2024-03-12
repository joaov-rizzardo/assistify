import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { RespondWorkspaceInviteUseCase } from './respond-workspace-invite-use-case';
import { UserNotificationRepository } from 'src/application/core/interfaces/repositories/user-notification-repository';
import { InMemoryWorkspaceMembersRepository } from 'src/test/repositories/in-memory-workspace-members-repository';
import { InMemoryUserNotificationRepository } from 'src/test/repositories/in-memory-user-notification-repository';
import { UserNotification } from 'src/application/core/entities/user-notification';
import { v4 as uuid } from 'uuid';
import { NotificationIsNotWorkspaceInviteError } from './errors/notification-is-not-workspace-invite-error';
import { WorkspaceInviteIsNotValidError } from './errors/workspace-invite-is-not-valid-error';
import { WorkspaceInviteIsAlreadyAcceptedError } from './errors/workspace-invite-is-already-accepted-error';

describe('Respond workspace invite use case', () => {
  let sut: RespondWorkspaceInviteUseCase;
  let workspaceMembersRepository: WorkspaceMembersRepository;
  let userNotificationRepository: UserNotificationRepository;

  beforeEach(async () => {
    workspaceMembersRepository = new InMemoryWorkspaceMembersRepository();
    userNotificationRepository = new InMemoryUserNotificationRepository();
    sut = new RespondWorkspaceInviteUseCase(
      workspaceMembersRepository,
      userNotificationRepository,
    );
  });

  it('should accept workspace invite', async () => {
    const workspaceMember = await workspaceMembersRepository.add({
      status: 'invited',
      role: 'member',
      userId: uuid(),
      workspaceId: uuid(),
    });
    const notification = await userNotificationRepository.create({
      type: 'workspace_invite',
      userId: workspaceMember.getUserId(),
      content: {
        invitingUserId: uuid(),
        type: 'workspace_invite',
        workspaceId: workspaceMember.getWorkspaceId(),
      },
    });
    const result = await sut.execute(notification, 'accept');
    const updatedMember = await workspaceMembersRepository.findWorkspaceMember(
      workspaceMember.getWorkspaceId(),
      workspaceMember.getUserId(),
    );
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const updatedNotification = result.value;
      expect(updatedNotification).toBeInstanceOf(UserNotification);
      expect(updatedNotification.getRead()).toBe(true);
      expect(updatedMember.getStatus()).toBe('accepted');
    }
  });

  it('should reject workspace invite', async () => {
    const workspaceMember = await workspaceMembersRepository.add({
      status: 'invited',
      role: 'member',
      userId: uuid(),
      workspaceId: uuid(),
    });
    const notification = await userNotificationRepository.create({
      type: 'workspace_invite',
      userId: workspaceMember.getUserId(),
      content: {
        invitingUserId: uuid(),
        type: 'workspace_invite',
        workspaceId: workspaceMember.getWorkspaceId(),
      },
    });
    const result = await sut.execute(notification, 'reject');
    const updatedMember = await workspaceMembersRepository.findWorkspaceMember(
      workspaceMember.getWorkspaceId(),
      workspaceMember.getUserId(),
    );
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const updatedNotification = result.value;
      expect(updatedNotification).toBeInstanceOf(UserNotification);
      expect(updatedNotification.getRead()).toBe(true);
      expect(updatedMember).toBeFalsy();
    }
  });

  it('should check if notification is a workspace invite', async () => {
    const workspaceMember = await workspaceMembersRepository.add({
      status: 'invited',
      role: 'member',
      userId: uuid(),
      workspaceId: uuid(),
    });
    const notification = await userNotificationRepository.create({
      type: 'message' as 'workspace_invite',
      userId: workspaceMember.getUserId(),
    });
    const result = await sut.execute(notification, 'accept');
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(
        NotificationIsNotWorkspaceInviteError,
      );
    }
  });

  it('should check if invite is still valid', async () => {
    const workspaceMember = await workspaceMembersRepository.add({
      status: 'invited',
      role: 'member',
      userId: uuid(),
      workspaceId: uuid(),
    });
    const notification = await userNotificationRepository.create({
      type: 'workspace_invite',
      userId: uuid(),
      content: {
        invitingUserId: uuid(),
        type: 'workspace_invite',
        workspaceId: workspaceMember.getWorkspaceId(),
      },
    });
    const result = await sut.execute(notification, 'accept');
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      const error = result.value;
      expect(error).toBeInstanceOf(WorkspaceInviteIsNotValidError);
    }
  });

  it('should check if invite is already accepted', async () => {
    const workspaceMember = await workspaceMembersRepository.add({
      status: 'accepted',
      role: 'member',
      userId: uuid(),
      workspaceId: uuid(),
    });
    const notification = await userNotificationRepository.create({
      type: 'workspace_invite',
      userId: workspaceMember.getUserId(),
      content: {
        invitingUserId: uuid(),
        type: 'workspace_invite',
        workspaceId: workspaceMember.getWorkspaceId(),
      },
    });
    const result = await sut.execute(notification, 'accept');
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      const error = result.value;
      expect(error).toBeInstanceOf(WorkspaceInviteIsAlreadyAcceptedError);
    }
  });
});
