import { IsMemberRole } from './custom-validators/is-member-role';
import { WorkspaceMemberRoles } from '../../entities/workspace-member';

export class ChangeWorkspaceMemberRoleDTO {
  @IsMemberRole({
    message: 'role field must be a valid role',
  })
  role: WorkspaceMemberRoles;
}
