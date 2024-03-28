import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { User } from 'src/application/core/entities/user';
import { PasswordEncrypter } from 'src/application/core/interfaces/cryptography/password-encrypter';
import { JwtTokenGenerator } from 'src/infra/libs/jwt/jwt-token-generator';
import { TokenFactory } from 'src/test/factories/make-token';
import { UserFactory, makeUser } from 'src/test/factories/make-user';
import * as request from 'supertest';

describe('Change user password (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let tokenFactory: TokenFactory;
  let passwordEncrypter: PasswordEncrypter;
  let user: User;
  let accessToken: string;
  let currentPassword: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory, TokenFactory, JwtTokenGenerator]
    }).compile();
    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    tokenFactory = moduleRef.get(TokenFactory);
    passwordEncrypter = moduleRef.get(PasswordEncrypter);
    const { email, lastName, name, password } = makeUser();
    currentPassword = password;
    user = await userFactory.makePrismaUser({
      email,
      lastName,
      name,
      password: await passwordEncrypter.encryptPassword(password)
    });
    accessToken = await tokenFactory.makeAccessToken(user);
    await app.init();
  });

  test('[PATCH] /users/password it should update user password', async () => {
    const response = await request(app.getHttpServer()).patch('/users/password').set('Authorization', `Bearer ${accessToken}`).send({
      currentPassword: currentPassword,
      newPassword: faker.internet.password()
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.code).toBe('PASSWORD_CHANGED');
  });

  test('[PATCH] /users/password it should check current password', async () => {
    const response = await request(app.getHttpServer()).patch('/users/password').set('Authorization', `Bearer ${accessToken}`).send({
      currentPassword: faker.internet.password(),
      newPassword: faker.internet.password()
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe('INCORRECT_USER_PASSWORD');
  });
});
