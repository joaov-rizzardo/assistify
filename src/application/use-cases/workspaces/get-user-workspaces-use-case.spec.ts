import { WorkspaceRepository } from 'src/application/core/interfaces/repositories/workspace-repository';
import { GetUserWorkspacesUseCase } from './get-user-workspaces-use-case';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { InMemoryWorkspaceRepository } from 'src/test/repositories/in-memory-workspace-repository';
import { InMemoryUserRepository } from 'src/test/repositories/in-memory-user-repository';
import { User } from 'src/application/core/entities/user';
import { Workspace } from 'src/application/core/entities/workspace';
import { makeUser } from 'src/test/factories/make-user';
import { makeWorkspace } from 'src/test/factories/make-workspace';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { InMemoryWorkspaceMembersRepository } from 'src/test/repositories/in-memory-workspace-members-repository';
import { WorkspaceMember } from 'src/application/core/entities/workspace-member';

describe('Get user workspaces use case', () => {
  let sut: GetUserWorkspacesUseCase;
  let workspaceRepository: WorkspaceRepository;
  let userRepository: UserRepository;
  let workspaceMembersRepository: WorkspaceMembersRepository;
  let user: User;
  let workspace: Workspace;
  let member: WorkspaceMember;

  beforeEach(async () => {
    workspaceRepository = new InMemoryWorkspaceRepository();
    userRepository = new InMemoryUserRepository();
    workspaceMembersRepository = new InMemoryWorkspaceMembersRepository();
    sut = new GetUserWorkspacesUseCase(
      workspaceRepository,
      workspaceMembersRepository,
    );
    const userData = makeUser();
    user = await userRepository.create({
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
    });
    const workspaceData = makeWorkspace();
    workspace = await workspaceRepository.create({
      name: workspaceData.name,
      ownerId: user.getId(),
    });
    member = await workspaceMembersRepository.add({
      userId: user.getId(),
      workspaceId: workspace.getId(),
      role: 'owner',
    });
  });

  it('should return user workspaces', async () => {
    const workspaces = await sut.execute(user.getId());
    expect(workspaces.length).toBe(1);
    const firstWorkspace = workspaces[0];
    expect(firstWorkspace.info).toBe(workspace);
    expect(firstWorkspace.member).toBe(member);
  });

  it('should return an empty array when user does not has any workspaces', async () => {
    const anotherUser = await userRepository.create(makeUser());
    const workspaces = await sut.execute(anotherUser.getId());
    expect(workspaces.length).toBe(0);
  });
});
