import { UseCaseError } from 'src/application/errors/use-case-error';

export class WorkspaceNotExistsError extends Error implements UseCaseError {
  constructor(workspaceId: string) {
    super(`Workspace not exists: ${workspaceId}`);
  }
}
