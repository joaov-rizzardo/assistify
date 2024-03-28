import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ example: 'John', required: true })
  @IsString({
    message: 'Name must be a string'
  })
  @Length(1, 50, {
    message: 'Name must has between 1 and 30 characters'
  })
  name: string;

  @ApiProperty({ example: 'Doe', required: true })
  @IsString({
    message: 'Last name must be a string'
  })
  @Length(1, 50, {
    message: 'Last name must has between 1 and 50 characters'
  })
  lastName: string;

  @ApiProperty({ example: 'johndoe@example.com', required: true })
  @IsEmail(undefined, {
    message: 'Email must be an email'
  })
  email: string;

  @ApiProperty({ example: 'password', required: true })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1
    },
    {
      message: 'Password must be strong'
    }
  )
  password: string;
}
