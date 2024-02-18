import { UseCaseError } from 'src/application/errors/use-case-error';

export class UserIsNotMemberFromWorkspaceError
  extends Error
  implements UseCaseError
{
  constructor(workspaceId: string, userId: string) {
    super(`User ${userId} is not a member from workspace ${workspaceId}`);
  }
}
