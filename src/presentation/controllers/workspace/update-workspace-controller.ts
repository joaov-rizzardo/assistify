import {
  Body,
  Controller,
  NotFoundException,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateWorkspaceUseCase } from 'src/application/use-cases/workspaces/update-workspace-use-case';
import {
  WorkspaceAuthenticationGuard,
  WorkspaceRequest,
} from 'src/infra/guards/workspace-authentication.guard';
import { WorkspacePresenter } from '../../presenters/workspace-presenter';
import { Roles } from 'src/infra/guards/roles';
import { UpdateWorkspaceDTO } from 'src/application/core/dtos/workspace/update-workspace-dto';

@Controller('workspaces')
export class UpdateWorkspaceController {
  constructor(
    private readonly updateWorkspaceUseCase: UpdateWorkspaceUseCase,
  ) {}

  @Roles(['owner', 'admin'])
  @UseGuards(WorkspaceAuthenticationGuard)
  @Patch()
  async handle(@Body() args: UpdateWorkspaceDTO, @Req() req: WorkspaceRequest) {
    const result = await this.updateWorkspaceUseCase.execute(
      req.workspace.id,
      args,
    );
    if (result.isLeft()) {
      throw new NotFoundException('Workspace not found');
    }
    const updatedWorkspace = result.value;
    return WorkspacePresenter.toHTTP(updatedWorkspace);
  }
}
