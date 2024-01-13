import { IsJWT } from 'class-validator';

export class RefreshTokenDTO {
  @IsJWT({
    message: 'Refresh token must be a valid token',
  })
  refreshToken: string;
}
