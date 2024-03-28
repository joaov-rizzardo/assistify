import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { User } from 'src/application/core/entities/user';
import { JwtTokenGenerator } from 'src/infra/libs/jwt/jwt-token-generator';
import { TokenFactory } from 'src/test/factories/make-token';
import { UserFactory } from 'src/test/factories/make-user';
import { WorkspaceFactory } from 'src/test/factories/make-workspace';
import * as request from 'supertest';

describe('Get user workspaces (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let tokenFactory: TokenFactory;
  let workspaceFactory: WorkspaceFactory;
  let user: User;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory, TokenFactory, WorkspaceFactory, JwtTokenGenerator]
    }).compile();
    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    tokenFactory = moduleRef.get(TokenFactory);
    workspaceFactory = moduleRef.get(WorkspaceFactory);
    user = await userFactory.makePrismaUser();
    accessToken = await tokenFactory.makeAccessToken(user);
    await app.init();
  });

  test('[GET] /workspaces it should return user workspaces', async () => {
    const createdWorkspace = await workspaceFactory.makePrismaWorkspace(user.getId());
    const response = await request(app.getHttpServer()).get('/workspaces').set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    const firstElement = response.body[0];
    expect(firstElement.info.id).toBe(createdWorkspace.getId());
    expect(firstElement.info.name).toBe(createdWorkspace.getName());
    expect(firstElement.info.ownerId).toBe(createdWorkspace.getOwnerId());
    expect(firstElement.info).toHaveProperty('createdAt');
    expect(firstElement.info).toHaveProperty('updatedAt');
    expect(firstElement.member.userId).toBe(user.getId());
    expect(firstElement.member.workspaceId).toBe(createdWorkspace.getId());
    expect(firstElement.member.role).toBe('owner');
    expect(firstElement.member).toHaveProperty('createdAt');
    expect(firstElement.member).toHaveProperty('updatedAt');
  });

  test("[GET] /workspaces it should return an empty array when user doesn't has unknown workspaces", async () => {
    const anotherUser = await userFactory.makePrismaUser();
    const token = await tokenFactory.makeAccessToken(anotherUser);
    const response = await request(app.getHttpServer()).get('/workspaces').set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
