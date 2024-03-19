import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { User } from 'src/application/core/entities/user';
import { JwtTokenGenerator } from 'src/infra/libs/jwt/jwt-token-generator';
import { TokenFactory } from 'src/test/factories/make-token';
import { UserFactory } from 'src/test/factories/make-user';
import * as request from 'supertest';
import { v4 as uuid } from 'uuid';

describe('Get user basic info (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let tokenFactory: TokenFactory;
  let user: User;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory, TokenFactory, JwtTokenGenerator],
    }).compile();
    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    tokenFactory = moduleRef.get(TokenFactory);
    user = await userFactory.makePrismaUser();
    accessToken = await tokenFactory.makeAccessToken(user);
    await app.init();
  });

  test('[GET] /users/basic/:id it should return user basic info', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/basic/${user.getId()}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(user.getName());
    expect(response.body.lastName).toBe(user.getLastName());
    expect(response.body.profilePicture).toBe(user.getProfilePicture());
    expect(response.body.id).toBe(user.getId());
  });

  test('[GET] /users/basic/:id it should check if user exists', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/basic/${uuid()}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.code).toBe('USER_NOT_EXISTS');
  });

  test('[GET] /users/basic/:id it should return any user basic info', async () => {
    const anotherUser = await userFactory.makePrismaUser();
    const response = await request(app.getHttpServer())
      .get(`/users/basic/${anotherUser.getId()}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(anotherUser.getName());
    expect(response.body.lastName).toBe(anotherUser.getLastName());
    expect(response.body.profilePicture).toBe(anotherUser.getProfilePicture());
    expect(response.body.id).toBe(anotherUser.getId());
  });
});
