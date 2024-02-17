import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  WorkspaceAuthenticationGuard,
  WorkspaceRequest,
} from 'src/infra/guards/workspace-authentication.guard';
import { Roles } from 'src/infra/guards/roles';
import { AddWorkspaceMemberUseCase } from 'src/application/use-cases/workspaces/add-workspace-member-use-case';
import { AddWorkspaceMemberDTO } from 'src/application/core/dtos/add-workspace-member-dto';
import { WorkspaceMemberPresenter } from '../presenters/workspace-member-presenter';

@Controller('workspaces/member')
export class AddWorkspaceMemberController {
  constructor(
    private readonly addWorkspacemMemberUseCase: AddWorkspaceMemberUseCase,
  ) {}

  @Roles(['owner', 'admin'])
  @UseGuards(WorkspaceAuthenticationGuard)
  @Post('/add')
  async handle(
    @Body() { role, userId }: AddWorkspaceMemberDTO,
    @Req() req: WorkspaceRequest,
  ) {
    const workspaceId = req.workspace.id;
    const result = await this.addWorkspacemMemberUseCase.execute(workspaceId, {
      role,
      userId,
    });
    if (result.isLeft()) {
      throw new BadRequestException('User not exists');
    }
    const member = result.value;
    return WorkspaceMemberPresenter.toHTTP(member);
  }
}
