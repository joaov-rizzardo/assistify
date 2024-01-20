import { WorkspaceMember } from 'src/application/core/entities/workspace-member';
import { v4 as uuid } from 'uuid';
import { WorkspaceMemberPresenter } from './workspace-member-presenter';

describe('Workspace member presenter', () => {
  let workspaceMember: WorkspaceMember;

  beforeEach(() => {
    workspaceMember = new WorkspaceMember({
      userId: uuid(),
      workspaceId: uuid(),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
  it('should present workspace member to http', () => {
    const result = WorkspaceMemberPresenter.toHTTP(workspaceMember);
    expect(result.userId).toBe(workspaceMember.getUserId());
    expect(result.workspaceId).toBe(workspaceMember.getWorkspaceId());
    expect(result.role).toBe(workspaceMember.getRole());
    expect(result.createdAt).toBe(workspaceMember.getCreatedAt());
    expect(result.updatedAt).toBe(workspaceMember.getUpdatedAt());
  });
});
