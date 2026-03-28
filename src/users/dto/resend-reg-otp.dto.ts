import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResendRegOtpDto {
  @ApiProperty({
    description: 'Email of the user.',
    required: true,
    type: String,
  })
  @IsEmail()
  email: string;

}
