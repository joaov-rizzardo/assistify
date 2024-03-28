import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { User } from 'src/application/core/entities/user';
import { Workspace } from 'src/application/core/entities/workspace';
import { UserNotificationRepository } from 'src/application/core/interfaces/repositories/user-notification-repository';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { JwtTokenGenerator } from 'src/infra/libs/jwt/jwt-token-generator';
import { TokenFactory } from 'src/test/factories/make-token';
import { UserFactory } from 'src/test/factories/make-user';
import { UserNotificationFactory } from 'src/test/factories/make-user-notification';
import { WorkspaceFactory } from 'src/test/factories/make-workspace';
import { WorkspaceMemberFactory } from 'src/test/factories/make-workspace-member';
import * as request from 'supertest';
import { v4 as uuid } from 'uuid';

describe('Reject workspace invite (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let tokenFactory: TokenFactory;
  let workspaceFactory: WorkspaceFactory;
  let workspaceMemberFactory: WorkspaceMemberFactory;
  let workspaceMembersRepository: WorkspaceMembersRepository;
  let userNotificationRepository: UserNotificationRepository;
  let userNotificationFactory: UserNotificationFactory;
  let workspace: Workspace;
  let user: User;
  let memberUser: User;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory, TokenFactory, WorkspaceFactory, WorkspaceMemberFactory, UserNotificationFactory, JwtTokenGenerator]
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    userFactory = moduleRef.get(UserFactory);
    tokenFactory = moduleRef.get(TokenFactory);
    workspaceFactory = moduleRef.get(WorkspaceFactory);
    workspaceMemberFactory = moduleRef.get(WorkspaceMemberFactory);
    userNotificationFactory = moduleRef.get(UserNotificationFactory);
    workspaceMembersRepository = moduleRef.get(WorkspaceMembersRepository);
    userNotificationRepository = moduleRef.get(UserNotificationRepository);
    user = await userFactory.makePrismaUser();
    workspace = await workspaceFactory.makePrismaWorkspace(user.getId());
    await app.init();
  });

  beforeEach(async () => {
    memberUser = await userFactory.makePrismaUser();
    await workspaceMemberFactory.makePrismaWorkspaceMember(workspace.getId(), memberUser.getId(), {
      role: 'editor',
      status: 'invited'
    });
    accessToken = await tokenFactory.makeAccessToken(memberUser);
  });

  test('[PATCH] /workspaces/:notificationId/reject it should reject workspace invite', async () => {
    const notification = await userNotificationFactory.makeUserNotification(memberUser.getId(), {
      read: false,
      type: 'workspace_invite',
      content: {
        type: 'workspace_invite',
        invitingUserId: user.getId(),
        workspaceId: workspace.getId()
      }
    });
    const response = await request(app.getHttpServer())
      .patch(`/workspaces/${notification.getId()}/reject/`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
    const updatedNotification = response.body;
    expect(updatedNotification.id).toBe(notification.getId());
    expect(updatedNotification.read).toBe(true);
    const member = await workspaceMembersRepository.findWorkspaceMember(workspace.getId(), memberUser.getId());
    expect(member).toBeFalsy();
  });

  test('[PATCH] /workspaces/:notificationId/reject it should check if notification exists', async () => {
    const response = await request(app.getHttpServer()).patch(`/workspaces/${uuid()}/reject/`).set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.code).toBe('NOTIFICATION_NOT_EXISTS');
  });

  test('[PATCH] /workspaces/:notificationId/reject it should check if user is authorized to access this resource', async () => {
    const notification = await userNotificationFactory.makeUserNotification(memberUser.getId(), {
      read: false,
      type: 'workspace_invite',
      content: {
        type: 'workspace_invite',
        invitingUserId: user.getId(),
        workspaceId: workspace.getId()
      }
    });
    const anotherUser = await userFactory.makePrismaUser();
    const accessToken = await tokenFactory.makeAccessToken(anotherUser);
    const response = await request(app.getHttpServer())
      .patch(`/workspaces/${notification.getId()}/reject/`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(401);
    expect(response.body.code).toBe('UNAUTHORIZED_USER');
  });

  test('[PATCH] /workspaces/:notificationId/reject it should check if invite is valid', async () => {
    const memberUser = await userFactory.makePrismaUser();
    const accessToken = await tokenFactory.makeAccessToken(memberUser);
    const notification = await userNotificationFactory.makeUserNotification(memberUser.getId(), {
      read: false,
      type: 'workspace_invite',
      content: {
        type: 'workspace_invite',
        invitingUserId: user.getId(),
        workspaceId: workspace.getId()
      }
    });
    const response = await request(app.getHttpServer())
      .patch(`/workspaces/${notification.getId()}/reject/`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe('WORKSPACE_INVITE_IS_NOT_VALID');
    const updatedNotification = await userNotificationRepository.findById(notification.getId());
    expect(updatedNotification.getRead()).toBe(true);
  });

  test('[PATCH] is should check if invite is already accepted', async () => {
    const memberUser = await userFactory.makePrismaUser();
    const accessToken = await tokenFactory.makeAccessToken(memberUser);
    await workspaceMemberFactory.makePrismaWorkspaceMember(workspace.getId(), memberUser.getId(), {
      role: 'editor',
      status: 'accepted'
    });
    const notification = await userNotificationFactory.makeUserNotification(memberUser.getId(), {
      read: false,
      type: 'workspace_invite',
      content: {
        type: 'workspace_invite',
        invitingUserId: user.getId(),
        workspaceId: workspace.getId()
      }
    });
    const response = await request(app.getHttpServer())
      .patch(`/workspaces/${notification.getId()}/reject/`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe('WORKSPACE_INVITE_IS_ALREADY_ACCEPTED');
    const updatedNotification = await userNotificationRepository.findById(notification.getId());
    expect(updatedNotification.getRead()).toBe(true);
    const member = await workspaceMembersRepository.findWorkspaceMember(workspace.getId(), memberUser.getId());
    expect(member).toBeTruthy();
  });
});
