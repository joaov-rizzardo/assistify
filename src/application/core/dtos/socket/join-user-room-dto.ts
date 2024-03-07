import { z } from 'zod';

export const JoinUserRoomSchema = z.object({
  userId: z.string().uuid('userId field must be valid id'),
});

export type JoinUserRoomDTO = z.infer<typeof JoinUserRoomSchema>;
