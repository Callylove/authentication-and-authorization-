import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

import { User, USER_STATUS } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { generateOtp } from 'src/utils/generate_random_code';
import { hashPassword } from 'src/utils/password_harsh';




import { RoleService } from 'src/role/role.service';

import { AuthService } from 'src/auth/auth.service';
import { ROLE_TYPE } from 'src/role/entities/role.entity';
import { ValidateRegOTPDto } from './dto/validate-reg-otp.dto';
import { tokenExpired } from 'src/utils/compare-date';



@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly authService: AuthService,

  ) {}

  async fetchUserForAuth(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        uuid: true,
        email: true,
        password: true,
        status: true,
        first_name: true,
        last_name: true,
        role: {
          id: true,
          uuid: true,
          type: true,
        },
      },
      relations: {
        role: true,
      },
    });
    if (!user) throw new BadRequestException('User not found. Please create an account');

    return user;
  }
  async sendRegOTP(user: User) {
    if (!user.id) throw new BadRequestException('User not found.');
    user.otp = generateOtp({ length: 4 });
    user.otp_created_at = new Date();
    await this.userRepository.save(user);
console.log({USEROTP: user.otp});

  }

  async create(dto: CreateUserDto) {
    const userExists = await this.userRepository.findOne({
      where: { email: dto.email },
      relations: {
        role: true,

      },
    });

const userRole = await this.roleService.findOneWithType(ROLE_TYPE.USER);
    if (userExists) {
      if (userExists.status == USER_STATUS.PENDING) {
        ///User has not verified mail
        userExists.role = userRole;
        userExists.password = await hashPassword(dto.password.trim());
  
        const {otp, otp_created_at, role, password, ...saved} = await this.userRepository.save(userExists);
        ///Send OTP to user email
        await this.sendRegOTP(userExists);


        return saved;
      }
      throw new BadRequestException('User already exists');
    }
    const user = new User();
    user.role = userRole;
    user.email = dto.email.trim().toLowerCase();
    user.first_name = dto.first_name.trim();
    user.last_name = dto.last_name.trim();
    user.password = await hashPassword(dto.password.trim());

    const {otp, otp_created_at, role, password, ...saved}  = await this.userRepository.save(user);


    ///Send OTP to user email
    await this.sendRegOTP(user);



    return saved;
  }

  async resendRegistrationOTP({ email }: { email: string }) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) throw new BadRequestException('User not found');
    if (user.status != USER_STATUS.PENDING)
      throw new BadRequestException('Unauthorized request');
    await this.sendRegOTP(user);
  }

  async verifyOtp(dto: ValidateRegOTPDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
        uuid: true,
        email: true,
        otp: true,
        otp_created_at: true,
        first_name: true,
        last_name: true,
        role: {
          id: true,
          uuid: true,
          type: true,
        },
      },
      relations: {
        role: true,
      },
    });
    if (!user) throw new BadRequestException('User not found.');

 

    if (!user.otp || !user.otp_created_at)
      throw new BadRequestException('Inavlid otp code');

    if (user.otp !== dto.otp) {
      throw new BadRequestException('Invalid OTP');
    }
    const otpExxpired = tokenExpired({
      tokenExpiryDate: user.otp_created_at!,
    });
    if (otpExxpired) {
      throw new BadRequestException('OTP expired.');
    }

    user.otp = null; // Clear OTP after validation
    user.otp_created_at = null; // Clear OTP expiration after validation
    user.status = USER_STATUS.VERIFIED_MAIL;
    await this.userRepository.save(user);
    ///Return jwt token
    // const response = await this.authService.login(user);


    // return response;
  }



 

 
  async findUserByUUID({ uuid }: { uuid: string }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { uuid },
      relations: {
        role: true,
      },
    });
    if (!user) throw new BadRequestException('User not found');
    return user;
  }



   async findUserRoleByUUID({ uuid }: { uuid: string }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { uuid },
      relations: { role: true },
    });
    if (!user) throw new BadRequestException('User not found');
    if (!user.role) throw new BadRequestException('User role not found');

    return user;
  }





 


}
