import { UseCaseError } from 'src/application/errors/use-case-error';

export class NotificationIsNotWorkspaceInviteError extends Error implements UseCaseError {
  constructor(notificationId: string) {
    super(`Notification ${notificationId} isn't a workspace invite`);
  }
}
