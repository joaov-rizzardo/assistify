import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDTO } from 'src/application/core/dtos/refresh-token-dto';
import { RefreshTokenUseCase } from 'src/application/use-cases/authentication/refresh-token-use-case';

@Controller('auth/token')
export class RefreshTokenController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  @Post('refresh')
  @HttpCode(200)
  async handle(@Body() { refreshToken }: RefreshTokenDTO) {
    const result = await this.refreshTokenUseCase.execute({ refreshToken });
    if (result.isLeft()) {
      throw new UnauthorizedException();
    }
    const { accessToken } = result.value;
    return {
      accessToken,
    };
  }
}
