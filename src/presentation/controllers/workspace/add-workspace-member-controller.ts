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
import { WorkspaceMemberPresenter } from '../../presenters/workspace-member-presenter';
import { UserNotExistsError } from 'src/application/errors/user-not-exists-error';
import { CannotAddMemberAsOwnerError } from 'src/application/use-cases/workspaces/errors/cannot-add-member-as-owner-error';
import { AddWorkspaceMemberDTO } from 'src/application/core/dtos/workspace/add-workspace-member-dto';
import { UserIsAlreadyWorkspaceMemberError } from 'src/application/use-cases/workspaces/errors/user-is-already-workspace-member-error';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Workspaces')
@Controller('workspaces/member')
export class AddWorkspaceMemberController {
  constructor(
    private readonly addWorkspacemMemberUseCase: AddWorkspaceMemberUseCase,
  ) {}

  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-workspace',
    description: 'Workspace ID',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Response when workspace member was added successfully',
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
  @Post('/add')
  async handle(
    @Body() { role, userId }: AddWorkspaceMemberDTO,
    @Req() req: WorkspaceRequest,
  ) {
    const workspaceId = req.workspace.id;
    const result = await this.addWorkspacemMemberUseCase.execute(workspaceId, {
      role,
      userId,
      invitingUserId: req.userId,
    });
    if (result.isLeft()) {
      const error = result.value;
      if (error instanceof UserNotExistsError) {
        throw new BadRequestException({
          message: error.message,
          code: 'USER_NOT_EXISTS',
        });
      }
      if (error instanceof CannotAddMemberAsOwnerError) {
        throw new BadRequestException({
          message: error.message,
          code: 'CANNOT_ADD_OWNER',
        });
      }
      if (error instanceof UserIsAlreadyWorkspaceMemberError) {
        throw new BadRequestException({
          message: error.message,
          code: 'USER_IS_ALREADY_MEMBER',
        });
      }
    }
    if (result.isRight()) {
      const member = result.value;
      return WorkspaceMemberPresenter.toHTTP(member);
    }
  }
}
