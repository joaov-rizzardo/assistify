import { Body, Controller, HttpCode, Post, UnauthorizedException } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDTO } from 'src/application/core/dtos/authentication/refresh-token-dto';
import { RefreshTokenUseCase } from 'src/application/use-cases/authentication/refresh-token-use-case';

@ApiTags('Authentication')
@Controller('auth/token')
export class RefreshTokenController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  @ApiResponse({ status: 200, description: 'Access token refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @Post('refresh')
  @HttpCode(200)
  async handle(@Body() { refreshToken }: RefreshTokenDTO) {
    const result = await this.refreshTokenUseCase.execute({ refreshToken });
    if (result.isLeft()) {
      throw new UnauthorizedException();
    }
    const { accessToken } = result.value;
    return {
      accessToken
    };
  }
}
