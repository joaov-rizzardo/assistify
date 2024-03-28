import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { User } from 'src/application/core/entities/user';
import { JwtTokenGenerator } from 'src/infra/libs/jwt/jwt-token-generator';
import { TokenFactory, makeToken } from 'src/test/factories/make-token';
import { UserFactory } from 'src/test/factories/make-user';
import { WorkspaceFactory } from 'src/test/factories/make-workspace';
import * as request from 'supertest';

describe('Refresh token (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let tokenFactory: TokenFactory;
  let user: User;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory, TokenFactory, WorkspaceFactory, JwtTokenGenerator]
    }).compile();
    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    tokenFactory = moduleRef.get(TokenFactory);
    user = await userFactory.makePrismaUser();
    await app.init();
  });

  test('[POST] /auth/token/refresh it should refresh access token', async () => {
    const refreshToken = await tokenFactory.makeRefreshToken(user);
    const response = await request(app.getHttpServer()).post('/auth/token/refresh').send({ refreshToken });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
  });

  test('[POST] /auth/token/refresh it should validate refresh token', async () => {
    const fakeToken = makeToken();
    const response = await request(app.getHttpServer()).post('/auth/token/refresh').send({ refreshToken: fakeToken });
    expect(response.statusCode).toBe(401);
  });
});
