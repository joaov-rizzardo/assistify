import { UseCaseError } from 'src/application/errors/use-case-error';

export class UserIsAlreadyWorkspaceMemberError
  extends Error
  implements UseCaseError
{
  constructor(userId: string, workspaceId: string) {
    super(`User ${userId} is already a member from workspace ${workspaceId}`);
  }
}
