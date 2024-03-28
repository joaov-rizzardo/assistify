import { IsMemberRole } from './custom-validators/is-member-role';
import { WorkspaceMemberRoles } from '../../entities/workspace-member';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeWorkspaceMemberRoleDTO {
  @ApiProperty({ example: 'admin', required: true })
  @IsMemberRole({
    message: 'role field must be a valid role'
  })
  role: WorkspaceMemberRoles;
}
