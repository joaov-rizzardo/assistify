import { Workspace } from 'src/application/core/entities/workspace';

export class WorkspacePresenter {
  static toHTTP(workspace: Workspace) {
    return {
      id: workspace.getId(),
      name: workspace.getName(),
      ownerId: workspace.getOwnerId(),
      createdAt: workspace.getCreatedAt(),
      updatedAt: workspace.getUpdatedAt(),
    };
  }

  static toBasic(workspace: Workspace) {
    return {
      id: workspace.getId(),
      name: workspace.getName(),
      ownerId: workspace.getOwnerId(),
      createdAt: workspace.getCreatedAt(),
    };
  }
}
