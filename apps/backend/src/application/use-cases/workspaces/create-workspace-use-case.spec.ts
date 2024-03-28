import { WorkspaceRepository } from 'src/application/core/interfaces/repositories/workspace-repository';
import { CreateWorkspaceUseCase } from './create-workspace-use-case';
import { InMemoryWorkspaceRepository } from 'src/test/repositories/in-memory-workspace-repository';
import { makeWorkspace } from 'src/test/factories/make-workspace';
import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { UserRepository } from 'src/application/core/interfaces/repositories/user-repository';
import { User } from 'src/application/core/entities/user';
import { InMemoryWorkspaceMembersRepository } from 'src/test/repositories/in-memory-workspace-members-repository';
import { InMemoryUserRepository } from 'src/test/repositories/in-memory-user-repository';
import { makeUser } from 'src/test/factories/make-user';
import { RunTransactionOperation } from 'src/application/core/interfaces/database/run-transaction-operation';
import { FakeTransactionOperation } from 'src/test/database/fake-transaction-operation';

describe('Create workspace use-case', () => {
  let workspaceRepository: WorkspaceRepository;
  let workspaceMembersRepository: WorkspaceMembersRepository;
  let userRepository: UserRepository;
  let transactionOperation: RunTransactionOperation;
  let sut: CreateWorkspaceUseCase;
  let user: User;

  beforeEach(async () => {
    workspaceRepository = new InMemoryWorkspaceRepository();
    workspaceMembersRepository = new InMemoryWorkspaceMembersRepository();
    userRepository = new InMemoryUserRepository();
    transactionOperation = new FakeTransactionOperation();
    user = await userRepository.create(makeUser());
    sut = new CreateWorkspaceUseCase(workspaceRepository, workspaceMembersRepository, transactionOperation);
  });

  it('should create new workspace', async () => {
    const { name } = makeWorkspace();
    const workspace = await sut.execute({ name, userId: user.getId() });
    expect(workspace.getOwnerId()).toBe(user.getId());
    expect(workspace.getName()).toBe(name);
  });

  it('should add owner member', async () => {
    const { name } = makeWorkspace();
    const workspace = await sut.execute({ name, userId: user.getId() });
    const member = await workspaceMembersRepository.findWorkspaceMember(workspace.getId(), user.getId());
    expect(member).not.toBe(null);
    if (member !== null) {
      expect(member.getUserId()).toBe(user.getId());
      expect(member.getRole()).toBe('owner');
      expect(member.getStatus()).toBe('accepted');
    }
  });
});
