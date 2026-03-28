import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ValidateRegOTPDto {
  @ApiProperty({
    description: 'Email of the user.',
    required: true,
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'OTP sent to the user.',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
