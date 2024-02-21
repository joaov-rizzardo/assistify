import { WorkspaceMembersRepository } from 'src/application/core/interfaces/repositories/workspace-members-repository';
import { InMemoryWorkspaceMembersRepository } from 'src/test/repositories/in-memory-workspace-members-repository';
import { v4 as uuid } from 'uuid';
import { ChangeWorkspaceMemberRoleUseCase } from './change-workspace-member-role-use-case';
import { UserIsNotMemberFromWorkspaceError } from './errors/user-is-not-member-from-workspace-error';
import { CannotChangeMemberRoleToOwnerError } from './errors/cannot-change-member-role-to-owner-error';

describe('Change workspace member role use case', () => {
  let workspaceMembersRepository: WorkspaceMembersRepository;
  let sut: ChangeWorkspaceMemberRoleUseCase;

  beforeEach(async () => {
    workspaceMembersRepository = new InMemoryWorkspaceMembersRepository();
    sut = new ChangeWorkspaceMemberRoleUseCase(workspaceMembersRepository);
  });

  it('should change member role', async () => {
    const workspaceId = uuid();
    const memberId = uuid();
    await workspaceMembersRepository.add({
      workspaceId,
      userId: memberId,
      role: 'admin',
    });
    const result = await sut.execute(workspaceId, memberId, 'member');
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const updatedMember = result.value;
      expect(updatedMember.getRole()).toBe('member');
    }
  });

  it('should check if workspace has the member', async () => {
    const result = await sut.execute(uuid(), uuid(), 'moderator');
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      const error = result.value;
      expect(error).toBeInstanceOf(UserIsNotMemberFromWorkspaceError);
    }
  });

  it("shouldn't change member role to owner", async () => {
    const workspaceId = uuid();
    const memberId = uuid();
    await workspaceMembersRepository.add({
      workspaceId,
      userId: memberId,
      role: 'admin',
    });
    const result = await sut.execute(workspaceId, memberId, 'owner');
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      const error = result.value;
      expect(error).toBeInstanceOf(CannotChangeMemberRoleToOwnerError);
    }
  });
});
