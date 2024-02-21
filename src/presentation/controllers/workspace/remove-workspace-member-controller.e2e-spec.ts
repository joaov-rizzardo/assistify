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

describe('Remove workspace member (E2E)', () => {
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

  test('[Delete] /workspaces/member/remove/:userId it should remove workspace member', async () => {
    const userMember = await userFactory.makePrismaUser();
    await workspaceMembersRepository.add({
      userId: userMember.getId(),
      workspaceId: workspace.getId(),
      role: 'editor',
      status: 'accepted',
    });
    const response = await request(app.getHttpServer())
      .delete('/workspaces/member/remove/' + userMember.getId())
      .set('Authorization', `Bearer ${accessToken}`)
      .set('x-workspace', workspace.getId());
    expect(response.statusCode).toBe(200);
    const removedMember = await workspaceMembersRepository.findWorkspaceMember(
      workspace.getId(),
      userMember.getId(),
    );
    expect(removedMember).toBeFalsy();
  });

  test('[Delete] /workspaces/member/remove/:userId it should verify if user is a workspace member', async () => {
    const userMember = await userFactory.makePrismaUser();
    const response = await request(app.getHttpServer())
      .delete('/workspaces/member/remove/' + userMember.getId())
      .set('Authorization', `Bearer ${accessToken}`)
      .set('x-workspace', workspace.getId());
    expect(response.statusCode).toBe(400);
    const body = response.body;
    expect(body.code).toBe('USER_IS_NOT_WORKSPACE_MEMBER');
  });

  test("[Delete] /workspaces/member/remove/:userId it shouldn't remove owner member", async () => {
    const response = await request(app.getHttpServer())
      .delete('/workspaces/member/remove/' + user.getId())
      .set('Authorization', `Bearer ${accessToken}`)
      .set('x-workspace', workspace.getId());
    expect(response.statusCode).toBe(400);
    const body = response.body;
    expect(body.code).toBe('CANNOT_REMOVE_OWNER');
  });
});
