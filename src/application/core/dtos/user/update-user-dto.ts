import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty({ example: 'John', required: false })
  @IsString({
    message: 'Name must be a string',
  })
  @Length(1, 50, {
    message: 'Name must has between 1 and 30 characters',
  })
  name?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsString({
    message: 'Last name must be a string',
  })
  @Length(1, 50, {
    message: 'Last name must has between 1 and 50 characters',
  })
  lastName?: string;

  @ApiProperty({
    example: '0eb46372-893d-4889-9ec9-1c4569b71722',
    required: false,
  })
  @IsString({
    message: 'Profile picture must be a string',
  })
  @IsUUID('4', {
    message: 'Profile picture must be a valid id',
  })
  profilePicture?: string;
}
