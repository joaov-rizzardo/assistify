import {
  BadRequestException,
  Controller,
  NotFoundException,
  Param,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserNotificationRepository } from 'src/application/core/interfaces/repositories/user-notification-repository';
import { NotificationIsNotWorkspaceInviteError } from 'src/application/use-cases/workspaces/errors/notification-is-not-workspace-invite-error';
import { WorkspaceInviteIsAlreadyAcceptedError } from 'src/application/use-cases/workspaces/errors/workspace-invite-is-already-accepted-error';
import { WorkspaceInviteIsNotValidError } from 'src/application/use-cases/workspaces/errors/workspace-invite-is-not-valid-error';
import { RespondWorkspaceInviteUseCase } from 'src/application/use-cases/workspaces/respond-workspace-invite-use-case';
import {
  UserAuthenticationGuard,
  UserRequest,
} from 'src/infra/guards/user-authentication.guard';

@ApiTags('Workspaces')
@Controller('workspaces')
export class AcceptWorkspaceInviteController {
  constructor(
    private readonly responseWorkspaceInviteUseCase: RespondWorkspaceInviteUseCase,
    private readonly userNotificationRepository: UserNotificationRepository,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Response when workspace invite was accepted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Workspace invite not found',
  })
  @ApiResponse({
    status: 401,
    description: 'User not authorized to access this resource',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request error',
  })
  @UseGuards(UserAuthenticationGuard)
  @Patch(':notificationId/accept')
  async handle(
    @Param('notificationId') notificationId: string,
    @Req() req: UserRequest,
  ) {
    const notification =
      await this.userNotificationRepository.findById(notificationId);
    if (!notification) {
      throw new NotFoundException({
        message: `Notification ${notificationId} not exists`,
        code: 'NOTIFICATION_NOT_EXISTS',
      });
    }
    if (notification.getUserId() !== req.userId) {
      throw new UnauthorizedException({
        message: 'User not authorized to access this resource',
        code: 'UNAUTHORIZED_USER',
      });
    }
    const result = await this.responseWorkspaceInviteUseCase.execute(
      notification,
      'accept',
    );
    if (result.isLeft()) {
      const error = result.value;
      if (error instanceof NotificationIsNotWorkspaceInviteError) {
        throw new BadRequestException({
          message: error.message,
          code: 'NOTIFICATION_IS_NOT_WORKSPACE_INVITE',
        });
      }
      if (error instanceof WorkspaceInviteIsNotValidError) {
        throw new BadRequestException({
          message: error.message,
          code: 'WORKSPACE_INVITE_IS_NOT_VALID',
        });
      }
      if (error instanceof WorkspaceInviteIsAlreadyAcceptedError) {
        throw new BadRequestException({
          message: error.message,
          code: 'WORKSPACE_INVITE_IS_ALREADY_ACCEPTED',
        });
      }
    }
    if (result.isRight()) {
      const updatedNotification = result.value;
      return updatedNotification;
    }
  }
}
