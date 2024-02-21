import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthenticateUserDTO {
  @IsEmail(undefined, { message: 'Email must be an email' })
  email: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
