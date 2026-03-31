import {
  Controller,
  Get,
  Post,
  Body,
 
  Param,

  UseGuards,

  HttpCode,
  HttpStatus,
  Put,

} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { appException, appResponse } from 'src/utils/response';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UseRoles } from 'src/auth/decorator/role.decorator';
import { ROLE_TYPE } from 'src/role/entities/role.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedInUser, UserAuth } from 'src/utils/decorator';
import { ValidateRegOTPDto } from './dto/validate-reg-otp.dto';
import { UsersService } from './users.service';
import { ResendRegOtpDto } from './dto/resend-reg-otp.dto';




@Controller('user')
@ApiTags('User')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create User. User can be host or a guest' })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const data = await this.userService.create(createUserDto);
      console.log({CREATEUSER: data});
      
      return appResponse({ data });
    } catch (e) {
      appException(e);
    }
  }

  @Put('resend-reg-otp')
  @ApiOperation({
    summary: 'Resend registration otp to a user',
  })
  async resendRegOtp(@Body() dto: ResendRegOtpDto) {
    try {
      const data = await this.userService.resendRegistrationOTP(dto);
      console.log({RESENDOTP: data});
      
      return appResponse({ data });
    } catch (e) {
      appException(e);
    }
  }

  @Post('reg-otp-verification')
  @ApiOperation({
    summary: 'Validate the otp that was sent to a user after registration',
  })
  async verifyRegOtp(@Body() dto: ValidateRegOTPDto) {
    try {
      const data = await this.userService.verifyOtp(dto);
      console.log({VERIFYOTP: data});
      
      return appResponse({ data });
    } catch (e) {
      appException(e);
    }
  }


  @Get(':uuid')
  @UseGuards(JwtGuard, RoleGuard)
  @UseRoles(ROLE_TYPE.ADMIN, ROLE_TYPE.USER)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch User details' })
  async findUserDetailsByUUID(
    @Param('uuid') uuid: string,
    @UserAuth() authUser: LoggedInUser,
  ) {
    try {
      const {role, ...data} = await this.userService.findUserByUUID({uuid});
      
      console.log({GETUSRID: data});
      
      return appResponse({
        data,
      });
    } catch (e) {
      appException(e);
    }
  }

 

 

  






}
