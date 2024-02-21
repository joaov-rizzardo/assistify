import { UseCaseError } from 'src/application/errors/use-case-error';

export class CannotChangeMemberRoleToOwnerError
  extends Error
  implements UseCaseError
{
  constructor(workspaceId: string, userId: string) {
    super(
      `Cannot change member ${userId} to owner on workspace ${workspaceId}`,
    );
  }
}
