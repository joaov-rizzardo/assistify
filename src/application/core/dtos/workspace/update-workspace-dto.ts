import { Length } from 'class-validator';

export class UpdateWorkspaceDTO {
  @Length(1, 50, {
    message: 'Name must has between 1 and 50 characters',
  })
  name: string;
}
