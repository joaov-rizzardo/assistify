import { Workspace } from 'src/application/core/entities/workspace';
import { makeWorkspace } from 'src/test/factories/make-workspace';
import { v4 as uuid } from 'uuid';
import { WorkspacePresenter } from './workspace-presenter';

describe('Workspace presenter', () => {
  let workspace: Workspace;

  beforeEach(() => {
    const { name } = makeWorkspace();
    workspace = new Workspace({
      id: uuid(),
      name,
      ownerId: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should present workspace to http', () => {
    const data = WorkspacePresenter.toHTTP(workspace);
    expect(data.createdAt).toBe(workspace.getCreatedAt());
    expect(data.id).toBe(workspace.getId());
    expect(data.name).toBe(workspace.getName());
    expect(data.ownerId).toBe(workspace.getOwnerId());
    expect(data.updatedAt).toBe(workspace.getUpdatedAt());
  });
});
