import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from 'class-validator';

export class ChangeUserPasswordDTO {
  @ApiProperty({ example: 'password123@', required: true })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message: 'Current password must be strong',
    },
  )
  currentPassword: string;

  @ApiProperty({ example: '123password@', required: true })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message: 'New password must be strong',
    },
  )
  newPassword: string;
}
