import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { UserFactory, makeUser } from 'src/test/factories/make-user';
import * as request from 'supertest';

describe('Create user (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory],
    }).compile();
    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    userRepository = moduleRef.get(UserRepository);
    await app.init();
  });

  test('[POST] /users it should create new user', async () => {
    const { name, email, lastName, password } = makeUser();
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ name, email, lastName, password });
    expect(response.body).toHaveProperty('id');
    const userId = response.body.id;
    const userHaveBeenCreated =
      await userRepository.checkIfUserExistsById(userId);
    expect(userHaveBeenCreated).toBe(true);
    expect(response.statusCode).toBe(201);
    expect(response.body).not.toHaveProperty('password');
    expect(response.body.name).toBe(name);
    expect(response.body.lastName).toBe(lastName);
    expect(response.body.email).toBe(email);
  });

  test('[POST] /users it should return created user', async () => {
    const { name, email, lastName, password } = makeUser();
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ name, email, lastName, password });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body.name).toBe(name);
    expect(response.body.lastName).toBe(lastName);
    expect(response.body.email).toBe(email);
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
