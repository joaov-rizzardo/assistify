import { UpdateWorkspaceDTO } from 'src/application/core/dtos/update-workspace-dto';
import { Workspace } from 'src/application/core/entities/workspace';
import {
  CreateWorkspaceProps,
  WorkspaceRepository,
} from 'src/application/core/interfaces/repositories/workspace-repository';
import { v4 as uuid } from 'uuid';

export class InMemoryWorkspaceRepository implements WorkspaceRepository {
  private workspaces: Workspace[] = [];

  async create({ name, ownerId }: CreateWorkspaceProps): Promise<Workspace> {
    const workspace = new Workspace({
      id: uuid(),
      name: name,
      ownerId: ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.workspaces.push(workspace);
    return workspace;
  }

  async findById(workspaceId: string): Promise<Workspace> {
    const workspace = this.workspaces.find(
      (workspace) => workspace.getId() === workspaceId,
    );
    return workspace || null;
  }

  async update(
    workspaceId: string,
    { name }: Partial<UpdateWorkspaceDTO>,
  ): Promise<Workspace> {
    const workspaceIndex = this.workspaces.findIndex(
      (workspace) => workspace.getId() === workspaceId,
    );
    if (workspaceIndex === -1) {
      return null;
    }
    this.workspaces = this.workspaces.map((workspace) => {
      if (workspace.getId() === workspaceId) {
        return new Workspace({
          id: workspace.getId(),
          name: name || workspace.getName(),
          createdAt: workspace.getCreatedAt(),
          ownerId: workspace.getOwnerId(),
          updatedAt: new Date(),
        });
      }
      return workspace;
    });
    return this.workspaces[workspaceIndex];
  }
}
