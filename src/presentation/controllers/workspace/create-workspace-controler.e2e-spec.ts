import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { User } from 'src/application/core/entities/user';
import { WorkspaceRepository } from 'src/application/core/interfaces/repositories/workspace-repository';
import { PrismaProvider } from 'src/infra/database/prisma/prisma-provider';
import { JwtTokenGenerator } from 'src/infra/libs/jwt/jwt-token-generator';
import { TokenFactory } from 'src/test/factories/make-token';
import { UserFactory } from 'src/test/factories/make-user';
import { makeWorkspace } from 'src/test/factories/make-workspace';
import * as request from 'supertest';

describe('Create workspace (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let tokenFactory: TokenFactory;
  let prisma: PrismaProvider;
  let user: User;
  let workspaceRepository: WorkspaceRepository;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory, TokenFactory, JwtTokenGenerator],
    }).compile();
    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    tokenFactory = moduleRef.get(TokenFactory);
    prisma = moduleRef.get(PrismaProvider);
    workspaceRepository = moduleRef.get(WorkspaceRepository);
    user = await userFactory.makePrismaUser();
    accessToken = await tokenFactory.makeAccessToken(user);
    await app.init();
  });

  test('[POST] /workspaces/create it should create workspace', async () => {
    const { name } = makeWorkspace();
    const response = await request(app.getHttpServer())
      .post('/workspaces/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    const addedWorkspace = await workspaceRepository.findById(response.body.id);
    expect(addedWorkspace).toBeTruthy();
    expect(response.body.name).toBe(name);

    expect(response.body.ownerId).toBe(user.getId());
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');

    const workspaceId = response.body.id;

    const createdWorkspace = await prisma.client.workspaces.findFirst({
      where: { id: workspaceId },
    });

    expect(createdWorkspace).toBeTruthy();
  });

  test('[POST] /workspaces/create it should return created workspace', async () => {
    const { name } = makeWorkspace();
    const response = await request(app.getHttpServer())
      .post('/workspaces/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(name);
    expect(response.body.ownerId).toBe(user.getId());
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });
});
