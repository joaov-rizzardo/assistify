import { IsUUID } from 'class-validator';
import { IsMemberRole } from './custom-validators/is-member-role';
import { WorkspaceMemberRoles } from '../../entities/workspace-member';

export class AddWorkspaceMemberDTO {
  @IsUUID(undefined, {
    message: 'userId field must be valid id',
  })
  userId: string;

  @IsMemberRole({
    message: 'role field must be a valid role',
  })
  role: WorkspaceMemberRoles;
}
