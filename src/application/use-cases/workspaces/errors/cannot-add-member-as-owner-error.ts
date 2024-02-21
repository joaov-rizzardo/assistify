import { UseCaseError } from 'src/application/errors/use-case-error';

export class CannotAddMemberAsOwnerError extends Error implements UseCaseError {
  constructor(workspaceId: string, userId: string) {
    super(`Cannot add user ${userId} as a owner from workspace ${workspaceId}`);
  }
}
