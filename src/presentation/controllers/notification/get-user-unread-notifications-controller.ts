import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUnreadUserNotificationsUseCase } from 'src/application/use-cases/notifications/get-unread-user-notifications-use-case';
import {
  UserAuthenticationGuard,
  UserRequest,
} from 'src/infra/guards/user-authentication.guard';
import { UserNotificationPresenter } from 'src/presentation/presenters/user-notification-presenter';

@ApiTags('Notifications')
@Controller('notifications/user')
export class GetUserUnreadNotificationsController {
  constructor(
    private readonly getUnreadUserNotificationsUseCase: GetUnreadUserNotificationsUseCase,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User notifications found successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'User is not authorized to access this resource',
  })
  @UseGuards(UserAuthenticationGuard)
  @Get('unread')
  async handle(@Req() req: UserRequest) {
    const userId = req.userId;
    const notifications =
      await this.getUnreadUserNotificationsUseCase.execute(userId);
    return notifications.map((notification) =>
      UserNotificationPresenter.toHTTP(notification),
    );
  }
}
