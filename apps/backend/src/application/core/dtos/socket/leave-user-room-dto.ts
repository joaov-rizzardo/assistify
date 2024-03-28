import { z } from 'zod';

export const LeaveUserRoomSchema = z.object({
  userId: z.string().uuid('userId field must be valid id')
});

export type LeaveUserRoomDTO = z.infer<typeof LeaveUserRoomSchema>;
