import {
  BadRequestException,
  forwardRef,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AUTH_CREDENTIAL } from 'src/utils/enum';

import { UsersService } from 'src/users/users.service';
import { User, USER_STATUS } from 'src/users/entities/user.entity';

export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

  ) {}

  async authenticateUser({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<any> {
    const user = await this.userService.fetchUserForAuth(username);
    if (!user) throw new BadRequestException('Invalid credentials');
    if (!user.password) throw new BadRequestException('Please register for an account.');

    const correct = await this.isPasswordCorrect({
      password: user.password,
      password_new: password,
    });
    if (correct) {
      if (user.status === USER_STATUS.DISABLED) {
        throw new BadRequestException(
          'User account is disabled. Please contact support.',
        );
      }
      if (
        user.status !== USER_STATUS.ENABLED &&
        user.status !== USER_STATUS.VERIFIED_MAIL
      ) {
        ///Send them an otp
        await this.userService.sendRegOTP(user);
        throw new BadRequestException('User has not verified their email.');
      }

      const { password, ...data } = user;
      return data;
    }
    console.log({ password, save: user.password });
    console.log({ correct });
    throw new BadRequestException('Invalid credentials');
  }
  async isPasswordCorrect({
    password,
    password_new,
  }: {
    password: string;
    password_new: string;
  }) {
    return await bcrypt.compare(password_new, password);
  }

  /**
   * Login user and generate jwt token
   * @param user
   * @returns
   */
  async login(user: User) {
    const token = await this.signPayload({
      id: user.uuid,
      role: user.role?.type,
    });

    let responseData: any = {
      token,
      uuid: user.uuid,
      status: user.status,
      role: user.role?.type,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };
 
    return responseData;
  }

  async signPayload(payload: AUTH_CREDENTIAL): Promise<string> {
    try {
      const token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      });
      return token;
    } catch (error) {
      throw new InternalServerErrorException('Internal server exception!');
    }
  }
}
