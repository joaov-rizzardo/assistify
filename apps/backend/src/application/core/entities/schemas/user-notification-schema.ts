import { z } from 'zod';

export const UserNotificationTypesSchema = z.enum(['workspace_invite']);

export type UserNotificationTypes = z.infer<typeof UserNotificationTypesSchema>;

export const WorkspaceInviteSchema = z.object({
  type: z.literal('workspace_invite'),
  workspaceId: z.string(),
  invitingUserId: z.string()
});

export type WorkspaceInviteType = z.infer<typeof WorkspaceInviteSchema>;

export const UserNotificationContentSchema = WorkspaceInviteSchema;

export type UserNotificationContentType = z.infer<typeof UserNotificationContentSchema>;
