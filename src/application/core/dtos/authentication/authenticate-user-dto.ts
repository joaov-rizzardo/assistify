import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthenticateUserDTO {
  @ApiProperty({ example: 'johndoe@example.com', required: true })
  @IsEmail(undefined, { message: 'Email must be an email' })
  email: string;

  @ApiProperty({ example: 'password', required: true })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
