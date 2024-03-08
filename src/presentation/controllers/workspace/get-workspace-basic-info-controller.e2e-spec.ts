import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { User } from 'src/application/core/entities/user';
import { Workspace } from 'src/application/core/entities/workspace';
import { JwtTokenGenerator } from 'src/infra/libs/jwt/jwt-token-generator';
import { TokenFactory } from 'src/test/factories/make-token';
import { UserFactory } from 'src/test/factories/make-user';
import { WorkspaceFactory } from 'src/test/factories/make-workspace';
import * as request from 'supertest';
import { v4 as uuid } from 'uuid';

describe('Get user workspaces (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let tokenFactory: TokenFactory;
  let workspaceFactory: WorkspaceFactory;
  let user: User;
  let workspace: Workspace;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        UserFactory,
        TokenFactory,
        WorkspaceFactory,
        JwtTokenGenerator,
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    tokenFactory = moduleRef.get(TokenFactory);
    workspaceFactory = moduleRef.get(WorkspaceFactory);
    user = await userFactory.makePrismaUser();
    workspace = await workspaceFactory.makePrismaWorkspace(user.getId());
    accessToken = await tokenFactory.makeAccessToken(user);
    await app.init();
  });

  test('[GET] /workspaces/basic/:id it should return workspace basic info', async () => {
    const response = await request(app.getHttpServer())
      .get(`/workspaces/basic/${workspace.getId()}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
    const returnedWorkspace = response.body;
    expect(returnedWorkspace.id).toBe(workspace.getId());
    expect(returnedWorkspace.name).toBe(workspace.getName());
    expect(returnedWorkspace.ownerId).toBe(workspace.getOwnerId());
    expect(returnedWorkspace.createdAt).toBe(
      workspace.getCreatedAt().toISOString(),
    );
  });

  test('[GET] /workspaces/basic/:id it should check if workspace exists', async () => {
    const response = await request(app.getHttpServer())
      .get(`/workspaces/basic/${uuid()}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(404);
    const code = response.body.code;
    expect(code).toBe('WORKSPACE_NOT_EXISTS');
  });
});
