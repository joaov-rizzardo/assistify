import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { User } from 'src/application/core/entities/user';
import { Workspace } from 'src/application/core/entities/workspace';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { JwtTokenGenerator } from 'src/infra/libs/jwt/jwt-token-generator';
import { TokenFactory } from 'src/test/factories/make-token';
import { UserFactory } from 'src/test/factories/make-user';
import { WorkspaceFactory } from 'src/test/factories/make-workspace';
import * as request from 'supertest';
import { v4 as uuid } from 'uuid';

describe('Add workspace member (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let tokenFactory: TokenFactory;
  let workspaceFactory: WorkspaceFactory;
  let workspaceMembersRepository: WorkspaceMembersRepository;
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
    app.useGlobalPipes(new ValidationPipe());
    userFactory = moduleRef.get(UserFactory);
    tokenFactory = moduleRef.get(TokenFactory);
    workspaceFactory = moduleRef.get(WorkspaceFactory);
    workspaceMembersRepository = moduleRef.get(WorkspaceMembersRepository);
    user = await userFactory.makePrismaUser();
    accessToken = await tokenFactory.makeAccessToken(user);
    workspace = await workspaceFactory.makePrismaWorkspace(user.getId());
    await app.init();
  });

  test('[POST] /workspaces/member/add it should add workspace member', async () => {
    const userMember = await userFactory.makePrismaUser();
    const response = await request(app.getHttpServer())
      .post('/workspaces/member/add')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('x-workspace', workspace.getId())
      .send({
        userId: userMember.getId(),
        role: 'member',
      });
    expect(response.statusCode).toBe(201);
    const addedMember = await workspaceMembersRepository.findWorkspaceMember(
      workspace.getId(),
      userMember.getId(),
    );
    expect(addedMember).toBeTruthy();
  });

  test('[POST] /workspaces/member/add it should return added member', async () => {
    const userMember = await userFactory.makePrismaUser();
    const response = await request(app.getHttpServer())
      .post('/workspaces/member/add')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('x-workspace', workspace.getId())
      .send({
        userId: userMember.getId(),
        role: 'editor',
      });
    expect(response.statusCode).toBe(201);
    const addedMember = response.body;
    expect(addedMember.userId).toBe(userMember.getId());
    expect(addedMember.role).toBe('editor');
    expect(addedMember.workspaceId).toBe(workspace.getId());
    expect(addedMember).toHaveProperty('createdAt');
    expect(addedMember).toHaveProperty('updatedAt');
  });

  test("[POST] /workspaces/member/add it shouldn't add workspace member with owner role", async () => {
    const userMember = await userFactory.makePrismaUser();
    const response = await request(app.getHttpServer())
      .post('/workspaces/member/add')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('x-workspace', workspace.getId())
      .send({
        userId: userMember.getId(),
        role: 'owner',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe('CANNOT_ADD_OWNER');
  });

  test('[POST] /workspaces/member/add it should verify if user exists', async () => {
    const response = await request(app.getHttpServer())
      .post('/workspaces/member/add')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('x-workspace', workspace.getId())
      .send({
        userId: uuid(),
        role: 'member',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe('USER_NOT_EXISTS');
  });
});
