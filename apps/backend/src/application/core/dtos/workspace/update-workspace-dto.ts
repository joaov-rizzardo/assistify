import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class UpdateWorkspaceDTO {
  @ApiProperty({ example: 'My new workspace', required: true })
  @Length(1, 50, {
    message: 'Name must has between 1 and 50 characters'
  })
  name: string;
}
