import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { User } from 'src/application/core/entities/user';
import { UserNotification } from 'src/application/core/entities/user-notification';
import { JwtTokenGenerator } from 'src/infra/libs/jwt/jwt-token-generator';
import { TokenFactory } from 'src/test/factories/make-token';
import { UserFactory } from 'src/test/factories/make-user';
import { UserNotificationFactory } from 'src/test/factories/make-user-notification';
import * as request from 'supertest';

describe("Get user's unread notifications (E2E)", () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let tokenFactory: TokenFactory;
  let userNotificationFactory: UserNotificationFactory;
  let user: User;
  let accessToken: string;
  let unreadNotification: UserNotification;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory, TokenFactory, UserNotificationFactory, JwtTokenGenerator]
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    userFactory = moduleRef.get(UserFactory);
    tokenFactory = moduleRef.get(TokenFactory);
    userNotificationFactory = moduleRef.get(UserNotificationFactory);
    user = await userFactory.makePrismaUser();
    accessToken = await tokenFactory.makeAccessToken(user);
    unreadNotification = await userNotificationFactory.makeUserNotification(user.getId(), {
      read: false,
      type: 'workspace_invite'
    });
    await userNotificationFactory.makeUserNotification(user.getId(), {
      read: true,
      type: 'workspace_invite'
    });
    await app.init();
  });

  test('[GET] /notifications/user/unread it should return unread user notifications', async () => {
    const response = await request(app.getHttpServer()).get(`/notifications/user/unread`).set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
    const notifications = response.body;
    expect(notifications.length).toBe(1);
    const firstNotification = notifications[0];
    expect(firstNotification.read).toBe(false);
    expect(firstNotification.id).toBe(unreadNotification.getId());
    expect(firstNotification.userId).toBe(unreadNotification.getUserId());
    expect(firstNotification.read).toBe(unreadNotification.getRead());
    expect(firstNotification.type).toBe(unreadNotification.getType());
    expect(new Date(firstNotification.date)).toEqual(unreadNotification.getDate());
    expect(new Date(firstNotification.createdAt)).toEqual(unreadNotification.getCreatedAt());
    expect(new Date(firstNotification.updatedAt)).toEqual(unreadNotification.getUpdatedAt());
    expect(firstNotification.content).toBe(unreadNotification.getContent());
  });
});
