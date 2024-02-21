import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PasswordEncrypter } from 'src/application/core/interfaces/cryptography/password-encrypter';
import { BcryptPasswordEncrypter } from 'src/infra/libs/bcrypt/bcrypt-password-encrypter';
import { UserFactory, makeUser } from 'src/test/factories/make-user';
import * as request from 'supertest';

describe('Authenticate user (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let passwordEncrypter: PasswordEncrypter;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory, BcryptPasswordEncrypter],
    }).compile();
    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    passwordEncrypter = moduleRef.get(BcryptPasswordEncrypter);
    await app.init();
  });

  test('[POST] /auth/authenticate it should authenticate user', async () => {
    const { name, lastName, email, password } = makeUser();
    await userFactory.makePrismaUser({
      name,
      lastName,
      email,
      password: await passwordEncrypter.encryptPassword(password),
    });
    const response = await request(app.getHttpServer())
      .post('/auth/authenticate')
      .send({
        email,
        password,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });

  test('[POST] /auth/authenticate it should validate password', async () => {
    const { name, lastName, email, password } = makeUser();
    await userFactory.makePrismaUser({
      name,
      lastName,
      email,
      password: await passwordEncrypter.encryptPassword(password),
    });
    const { password: wrongPassword } = makeUser();
    const response = await request(app.getHttpServer())
      .post('/auth/authenticate')
      .send({
        email,
        password: wrongPassword,
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe('BAD_CREDENTIALS');
  });

  test('[POST] /auth/authenticate it should validate email', async () => {
    const { name, lastName, email, password } = makeUser();
    await userFactory.makePrismaUser({
      name,
      lastName,
      email,
      password: await passwordEncrypter.encryptPassword(password),
    });
    const { email: wrongEmail } = makeUser();
    const response = await request(app.getHttpServer())
      .post('/auth/authenticate')
      .send({
        email: wrongEmail,
        password,
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe('BAD_CREDENTIALS');
  });
});
