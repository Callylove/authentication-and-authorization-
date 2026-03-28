import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'email of the user',
    required: true,
    type: String,
  })
  @IsEmail()
  username: string;

  @ApiProperty({
    description: 'password of the user',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
