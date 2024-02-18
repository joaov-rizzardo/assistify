import { UseCaseError } from 'src/application/errors/use-case-error';

export class CannotRemoveOwnerFromWorkspaceError
  extends Error
  implements UseCaseError
{
  constructor(workspaceId: string, userId: string) {
    super(
      `User ${userId} is a owner and cannot be removed from workspace ${workspaceId}`,
    );
  }
}
