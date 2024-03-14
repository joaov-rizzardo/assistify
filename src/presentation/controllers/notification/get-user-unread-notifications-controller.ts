import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GetUnreadUserNotificationsUseCase } from 'src/application/use-cases/notifications/get-unread-user-notifications-use-case';
import {
  UserAuthenticationGuard,
  UserRequest,
} from 'src/infra/guards/user-authentication.guard';
import { UserNotificationPresenter } from 'src/presentation/presenters/user-notification-presenter';

@Controller('notifications/user')
export class GetUserUnreadNotificationsController {
  constructor(
    private readonly getUnreadUserNotificationsUseCase: GetUnreadUserNotificationsUseCase,
  ) {}

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
