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
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Workspaces')
@Controller('workspaces')
export class UpdateWorkspaceController {
  constructor(
    private readonly updateWorkspaceUseCase: UpdateWorkspaceUseCase,
  ) {}

  @ApiHeader({
    name: 'x-workspace',
    description: 'Workspace ID',
    required: true,
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Response when workspace was updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request error',
  })
  @ApiResponse({
    status: 401,
    description: 'User is not authorized to access this resource',
  })
  @Roles(['owner', 'admin'])
  @UseGuards(WorkspaceAuthenticationGuard)
  @Patch()
  async handle(@Body() args: UpdateWorkspaceDTO, @Req() req: WorkspaceRequest) {
    const result = await this.updateWorkspaceUseCase.execute(
      req.workspace.id,
      args,
    );
    if (result.isLeft()) {
      const error = result.value;
      throw new NotFoundException(error.message);
    }
    const updatedWorkspace = result.value;
    return WorkspacePresenter.toHTTP(updatedWorkspace);
  }
}
