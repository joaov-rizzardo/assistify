import { SetMetadata } from '@nestjs/common';
import { WorkspaceMemberRoles } from 'src/application/core/entities/workspace-member';

export const Roles = (roles: WorkspaceMemberRoles[]) => SetMetadata('roles', roles);
