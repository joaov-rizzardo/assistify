import { UseCaseError } from 'src/application/errors/use-case-error';

export class WorkspaceInviteIsNotValidError
  extends Error
  implements UseCaseError
{
  constructor(notificationId: string, userId: string, workspaceId: string) {
    super(
      `Notification ${notificationId} isn't a valid invite from workspace ${workspaceId} to ${userId}`,
    );
  }
}
