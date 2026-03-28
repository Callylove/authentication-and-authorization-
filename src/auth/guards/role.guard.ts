import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/role.decorator';

import { ROLE_TYPE } from 'src/role/entities/role.entity';
import { UsersService } from 'src/users/users.service';
import { appException } from 'src/utils/response';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRols = this.reflector.getAllAndOverride<ROLE_TYPE[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRols) return true;

    try {
      const { user } = context.switchToHttp().getRequest();
      console.log({ROLEGUARD: user});
      
      const u = await this.userService.findUserRoleByUUID({ uuid: user.id });
      const result: boolean = requiredRols.some((r) =>
        u.role?.type.includes(r),
      );

      if (result) {
        return result;
      } else throw new BadRequestException('Access denied!');
    } catch (e) {
      appException(e);
    }

    return false;
  }
}
