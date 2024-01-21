import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaProvider } from 'src/infra/database/prisma/prisma-provider';
import { UserFactory, makeUser } from 'src/test/factories/make-user';
import * as request from 'supertest';

describe('Create user (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaProvider;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory],
    }).compile();
    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaProvider);
    userFactory = moduleRef.get(UserFactory);
    await app.init();
  });

  test('[POST] /users it should create new user', async () => {
    const { name, email, lastName, password } = makeUser();
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ name, email, lastName, password });
    expect(response.statusCode).toBe(201);
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(name);
    expect(response.body.lastName).toBe(lastName);
    expect(response.body.email).toBe(email);
    const id = response.body.id;

    const userOnDatabase = await prisma.client.users.findFirst({
      where: { id },
    });
    expect(userOnDatabase).toBeTruthy();
  });

  test('[POST] /users it should check if another user with same email already exists', async () => {
    const user = await userFactory.makePrismaUser();
    const { name, lastName, password } = makeUser();
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ name, email: user.getEmail(), lastName, password });
    expect(response.statusCode).toBe(409);
  });
});
