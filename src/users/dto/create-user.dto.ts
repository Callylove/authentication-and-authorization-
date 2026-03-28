import { ApiProperty } from '@nestjs/swagger';

import {
  IsEmail,
 
  IsEnum,
 
  IsNotEmpty,

  IsOptional,

  IsString,
  IsStrongPassword,
} from 'class-validator';

export enum USER_ROLE {
  USER = 'user',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'User email',
    type: String,
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    type: String,
    required: true,
  })
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'User  first name',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'User last name',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;
    @ApiProperty({
    description: 'User role',
    enum: USER_ROLE,
    required: false,
  })
  @IsOptional()
  @IsEnum(USER_ROLE)
  role: USER_ROLE;

}
