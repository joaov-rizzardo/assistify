import { UseCaseError } from 'src/application/errors/use-case-error';

export class WorkspaceInviteIsAlreadyAcceptedError extends Error implements UseCaseError {
  constructor(userId: string, workspaceId: string) {
    super(`The invite from workspace ${workspaceId} to ${userId} is already accepted`);
  }
}
