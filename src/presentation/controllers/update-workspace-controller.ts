import {
  Body,
  Controller,
  NotFoundException,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateWorkspaceDTO } from 'src/application/core/dtos/update-workspace-dto';
import { UpdateWorkspaceUseCase } from 'src/application/use-cases/workspaces/update-workspace-use-case';
import {
  WorkspaceAuthenticationGuard,
  WorkspaceRequest,
} from 'src/infra/guards/workspace-authentication.guard';
import { WorkspacePresenter } from '../presenters/workspace-presenter';

@Controller('workspaces')
@UseGuards(WorkspaceAuthenticationGuard)
export class UpdateWorkspaceController {
  constructor(
    private readonly updateWorkspaceUseCase: UpdateWorkspaceUseCase,
  ) {}
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
