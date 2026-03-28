import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local.guard';
import { LoginDto } from './dto/login.dto';
import { appException, appResponse, ResponseData } from 'src/utils/response';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login.' })
async login(
  @Request() req: any,
  @Body() dto: LoginDto,
): Promise<ResponseData> {
  console.log({REQ: req});
   console.log({LOGINDTO: dto});
  
  try {
    const data = await this.authService.login(req.user);
    return appResponse({
      data,
      message: 'Logged in successfully',
    });
  } catch (e) {
    throw appException(e);
  }
}
}
