import { IsUUID } from 'class-validator';
import { IsMemberRole } from './custom-validators/is-member-role';
import { WorkspaceMemberRoles } from '../../entities/workspace-member';
import { ApiProperty } from '@nestjs/swagger';

export class AddWorkspaceMemberDTO {
  @ApiProperty({
    example: '5a5b5c5d5e5f5g5h5i5j5k5l5m5n5o5p5q5r5s5t5u5v5w5x5y5z',
    required: true,
  })
  @IsUUID(undefined, {
    message: 'userId field must be valid id',
  })
  userId: string;

  @ApiProperty({ example: 'admin', required: true })
  @IsMemberRole({
    message: 'role field must be a valid role',
  })
  role: WorkspaceMemberRoles;
}
